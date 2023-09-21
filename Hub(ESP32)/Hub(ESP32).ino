/*
 * 시스템 구성
 * FIREBASE(WEB Application, Database)
 * ↕ Wifi로 통신
 * HUB{ESP32<-Serial로 통신->Arduino Uno(LCD)}
 * ↕ BLE로 통신
 * Controller{ESP32+Servo}
 * 
 * WiFi BLE는 안테나가 하나라 동시에 안됨
 * ->Database에서 값이 생겨서 읽어오면 WiFi 해제 후 
 * ->BLE 연결, 컨트롤러로 명령 전달
 * ->명령 전달 완료되면 다시 웹 연결 
 * 
 * Serial 통신으로 Uno에서 입력되는 터치 값 받아오기
 * ->WiFi가 웹 연결된 상태에서 Serial이 입력되면,
 * ->WiFi 해제, BLE 연결->명령 전달->명령입력 후 다시 웹 연결
 */


#include <WiFi.h>
#include "BLEDevice.h"
#include <FirebaseESP32.h>

//Wifi하고 Firebase 관련 값, 변수
#define FIREBASE_HOST "Your-Project"
#define FIREBASE_AUTH "Your-Project"
FirebaseData firebaseData;

const char* WIFI_SSID     = "Your-Project";    // 연결할 WiFi
const char* WIFI_PASSWORD = "Your-Project";     // 연결할 WiFi의 비밀번호

//BLE 관련 값, 변수
static BLEUUID serviceUUID("6E400001-B5A3-F393-E0A9-E50E24DCCA9E"); //UID는 각 장치에 맞게 생성해서 입력
static BLEUUID rxUUID("6E400002-B5A3-F393-E0A9-E50E24DCCA9E");
static BLEUUID txUUID("6E400003-B5A3-F393-E0A9-E50E24DCCA9E");

static boolean doConnect = false;
static boolean connected = false;
static boolean doScan = false;
static boolean falseinput = false;

static BLERemoteCharacteristic* pRxCharacteristic;
static BLERemoteCharacteristic* pTxCharacteristic;
static BLEAdvertisedDevice* myDevice;

// WIFI, Database 연결
void WIFIinit(){
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD); // 잠시 꺼야하면 WiFi.mode(WIFI_OFF);
  while ((!(WiFi.status() == WL_CONNECTED))){
    delay(300);
    Serial.println("...");
  }
  Serial.println("connected");
  Serial.println((WiFi.localIP()));
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
}

static void notifyCallback(
  BLERemoteCharacteristic* pBLERemoteCharacteristic,
  uint8_t* pData,
  size_t length,
  bool isNotify) {
    //Serial.print("Notify callback for characteristic ");
    //Serial.print(pBLERemoteCharacteristic->getUUID().toString().c_str());
    //Serial.print(" of data length ");
    //Serial.println(length);
    //Serial.print("data: ");
    //Serial.println((char*)pData);  // 이게 데이터!
}

class MyClientCallback : public BLEClientCallbacks {
  void onConnect(BLEClient* pclient) {
  }
  void onDisconnect(BLEClient* pclient) {
    connected = false;
    doScan = true;
    Serial.println("onDisconnect");
  }
};

bool connectToServer() {  
    Serial.print("Forming a connection to ");   
    
    //myDevice는 연결할 정보가 담긴 변수->여기서 정보를 넣어줌
    Serial.println(myDevice->getAddress().toString().c_str());
    
    BLEClient*  pClient  = BLEDevice::createClient();
    Serial.println(" - Created client");
    pClient->setClientCallbacks(new MyClientCallback());
    pClient->connect(myDevice);
    Serial.println(" - Connected to server");
    BLERemoteService* pRemoteService = pClient->getService(serviceUUID);
    //UUID를 못가져올 시 연결해제->종료
    if (pRemoteService == nullptr) {        
      Serial.println(serviceUUID.toString().c_str());
      pClient->disconnect();
      return false;      
    }
    // Tx characteristic 받아오기
    pTxCharacteristic = pRemoteService->getCharacteristic(txUUID);
    if (pTxCharacteristic == nullptr) {
      Serial.print("Failed to find our characteristic UUID: ");
      Serial.println(txUUID.toString().c_str());
      pClient->disconnect();
      return false;
    }
    // Tx characteristic이 notify 지원하는지
    if(pTxCharacteristic->canNotify()) {    
      //데이터를 받을 콜백함수 등록
      pTxCharacteristic->registerForNotify(notifyCallback);
    }

    // Rx charateristic 받아오기
    pRxCharacteristic = pRemoteService->getCharacteristic(rxUUID);
    if (pRxCharacteristic == nullptr) {
      Serial.print("Failed to find our characteristic UUID: ");
      Serial.println(rxUUID.toString().c_str());
      pClient->disconnect();
      return false;
    } 
 
    // Rx characteristic이 write지원하는지
    if(!pRxCharacteristic->canWrite()) {
      Serial.print("Failed to find our characteristic UUID: ");
      Serial.println(rxUUID.toString().c_str());
      pClient->disconnect();
      return false;
    }
    // 여기까지 Client,Rx,Tx 연결완료
    // connectToServer()함수 마무리
    connected = true;
    return true;
}

// 주변 장치 검색함수 ( 서버는 수시로 advertising함 )
class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
  void onResult(BLEAdvertisedDevice advertisedDevice) {
    Serial.print("BLE Advertised Device found: ");    
    Serial.print(advertisedDevice.haveServiceUUID());
    Serial.print(" , ");
    Serial.println(advertisedDevice.toString().c_str());
    // // advertising정보에 같은 같은 Service UUID가 있는지 확인
    if (advertisedDevice.haveServiceUUID() && advertisedDevice.isAdvertisingService(serviceUUID)) {
      Serial.print("A device to be connected has been found.");
      BLEDevice::getScan()->stop();
      //해당 장치 정보를 myDevice에 저장
      myDevice = new BLEAdvertisedDevice(advertisedDevice);
      doConnect = true;
      doScan = false;
    }
  }
};

void BLEinit(){
  //BLE 클래스 초기화
  BLEDevice::init("");  //잠시 끄는 거는 if(BLEDevice::getInitialized()) BLEDevice::deinit(true);
  //스캔 클래스 생성
  BLEScan* pBLEScan = BLEDevice::getScan();
  //장치 검색되면 호출할 콜백함수 등록
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->start(0);
}

void Send(String CMD){
    if (doConnect == true) {
    if (connectToServer()) {
      //Serial.println("Connected to the BLE Server.");
      } else {
      //Serial.println("Failed to connect");
      }
      doConnect = false;
      }

  if (connected) {       
     pRxCharacteristic->writeValue(CMD.c_str(), CMD.length()); 
     Serial.print("Sent : ");
     Serial.println(CMD);
     }
  else if(doScan){
    BLEDevice::getScan()->start(0);
    }
  delay(1000);
}

void setup(){
  Serial.begin(115200);
  Serial2.begin(115200); // Uno하고 통신에 사용
  WIFIinit();
}
String Angle[10];
String command[50];    // 웹에서 받아온 명령어
String CmdToSend[50];  // 컨트롤러로 보낼 명령어

void loop()
{
 int command_index = 0;
 String command_ref = "";
 String command_directory = "";
 unsigned long StartTime;
 
 Serial2.println("Available");
 /*
  * 일단 조건문으로 DB값이 존재해야->Do-While 반복문 진입
  * do while이 끝나면->command[1]부터 입력값 저장 마지막에는 Done 저장
 */
 if(Firebase.RTDB.getString(&firebaseData, "/DEMOInfo/1")&& Angle[0] != "STOP" ){
  do{
  command_index += 1;
  command_ref = "/DEMOInfo/";
  command_directory = command_ref+command_index;
  Firebase.RTDB.getString(&firebaseData, command_directory);
  Angle[command_index] = firebaseData.stringData();
  //Serial.println(Angle[command_index]);
  }while(command_index != 8);
  Angle[0] = "STOP"; //STOP이 들어가니 이후에는 반복하지 않는다. 최초 실행시에만
  Serial.println("Success 1");
 }
 
 command_index = 0;
 if(Firebase.RTDB.getString(&firebaseData, "/DEMO/1") && firebaseData.stringData() != "STOP" && Firebase.RTDB.getString(&firebaseData, "/DEMO/Status") && firebaseData.stringData() == "0")
 {
  Firebase.RTDB.setInt(&firebaseData, "/DEMO/Status",2); // 1은 읽는 상태
  do{
    command_index += 1;
    command_ref = "/DEMO/";
    command_directory = command_ref+command_index;
    
    Firebase.RTDB.getString(&firebaseData, command_directory);
    command[command_index] = firebaseData.stringData();
    
    //Serial.print(command_index);
    //Serial.print(" : ");
    //Serial.println(command[command_index]);

    // 마지막 명령이 되면 1번 명령을 STOP으로 바꿔서 DB를 다시 불러오지 않게 함
    if(firebaseData.stringData() == "STOP"){
      Firebase.RTDB.setString(&firebaseData, "/DEMO/1","STOP");
      Firebase.RTDB.setInt(&firebaseData, "/DEMO/Status",0); // 0은 입력을 받는 상태
    }
  }while(command[command_index] != "STOP");

  /*
  */
  command_index = 0;
  if(command[1] != NULL){
   do{
      command_index += 1;
      if(command[command_index] == "STOP"){
        CmdToSend[command_index] = command[command_index].substring(0,4);
      }
      CmdToSend[command_index] = command[command_index].substring(0,10);
      //Serial.print("After Process");
      //Serial.print(command_index);
      //Serial.print(" : ");
      //Serial.println(CmdToSend[command_index]);
     
   }while(command[command_index] != "STOP");
   CmdToSend[0] = "WORK";
  }
  Serial.println("Success 2");
 }
 
 command_index = 0;
 if(CmdToSend[0] == "WORK")
 {
  Serial2.println("Not Available");
  Firebase.RTDB.setInt(&firebaseData, "/DEMO/Status",3); // 2는 입력을 전달하는 상태
  WiFi.disconnect();
  WiFi.mode(WIFI_OFF);
  Serial.println("WiFi OFF");
  delay(1000);
  
  BLEinit(); //BLE를 켜고 명령 전달
  delay(1000);
  do{
    command_index += 1;
    Send(CmdToSend[command_index]);
    delay(2000);
  }while(CmdToSend[command_index] != "STOP");
  CmdToSend[0] = "STOP";
  
  ESP.restart();
 }
 
 String text = "";
 command_index = 0;
 if( Serial2.available() > 0) //이후는 Serial2(아두이노 입력이 들어오면 작동)
 {
    command_index += 1;
  
  text = Serial2.readStringUntil('\n');
  //Serial.println(text);
  //Serial.println(text.length());
  text.trim();
  //Serial.println(text);
  //Serial.println(text.length());

      if(text.equals("Button 1")){
        CmdToSend[command_index] = Angle[1];
        falseinput = false;
      }
      else if(text.equals("Button 2")){
        CmdToSend[command_index] = Angle[2];
        falseinput = false;
      }
      else if(text.equals("Button 3")){
        CmdToSend[command_index] = Angle[3];
        falseinput = false;
      }
      else if(text.equals("Button 4")){
        CmdToSend[command_index] = Angle[4];
        falseinput = false;
      }
      else if(text.equals("Button 5")){
        CmdToSend[command_index] = Angle[5];
       falseinput = false;
      }
      else if(text.equals("Button 6")){
        CmdToSend[command_index] = Angle[6];
        falseinput = false;
      }
      else if(text.equals("Button 7")){
        CmdToSend[command_index] = Angle[7];
        falseinput = false;
      }
      else if(text.equals("Button 8")){
        CmdToSend[command_index] = Angle[8];
        falseinput = false;
      }
      else if(text.equals("STOP")){
          CmdToSend[command_index] = "STOP";
          falseinput = false;
        }
      else {
          Serial.print("error");
          command_index = 0;
           falseinput = true;
        }
      Serial.print(command_index);
      Serial.print(" : ");
      Serial.println(CmdToSend[command_index]);
      
    StartTime = millis(); // 여기서 StratTime을 공유해도 30초 후 빠져나가서 DB확인을 하게 됨
   do{
     if( Serial2.available() > 0){
        command_index += 1;
      
        text = Serial2.readStringUntil('\n');
        //Serial.println(text);
        //Serial.println(text.length());
        text.trim();
        //Serial.println(text);
        //Serial.println(text.length());
        
         if(text.equals("Button 1")){
          CmdToSend[command_index] = Angle[1];
          falseinput = false;
        }
        else if(text.equals("Button 2")){
          CmdToSend[command_index] = Angle[2];
          falseinput = false;
        }
        else if(text.equals("Button 3")){
          CmdToSend[command_index] = Angle[3];
          falseinput = false;
        }
        else if(text.equals("Button 4")){
          CmdToSend[command_index] = Angle[4];
          falseinput = false;
        }
        else if(text.equals("Button 5")){
          CmdToSend[command_index] = Angle[5];
          falseinput = false;
        }
        else if(text.equals("Button 6")){
          CmdToSend[command_index] = Angle[6];
          falseinput = false;
        }
        else if(text.equals("Button 7")){
          CmdToSend[command_index] = Angle[7];
          falseinput = false;
        }
        else if(text.equals("Button 8")){
          CmdToSend[command_index] = Angle[8];
          falseinput = false;
        }
        else if(text.equals("STOP")){
          CmdToSend[command_index] = "STOP";
          falseinput = false;
          break;
        }
        else if(falseinput == true){
          Serial.print("break");
          break;
        }
        
      Serial.print(command_index);
      Serial.print(" : ");
      Serial.println(CmdToSend[command_index]);
     }
   }while(StartTime + 30000 > millis()); //30초가 지나거나 WORK 신호가 들어오면 동작한다
       command_index += 1;
       CmdToSend[command_index] = "STOP";
       Serial.print(command_index);
       Serial.print(" : ");
       Serial.println(CmdToSend[command_index]);
   if(falseinput == false){
    Firebase.RTDB.setInt(&firebaseData, "/DEMO/Status",3); // 2는 입력을 전달하는 상태
    Serial2.println("Not Available");
    WiFi.disconnect();
    WiFi.mode(WIFI_OFF);

    Serial.println("WiFi OFF");
    delay(1000);
    BLEinit();
    delay(1000);
    
    command_index = 1;
    do{
    Send(CmdToSend[command_index]);
    command_index += 1;
    delay(2000);
    }while(CmdToSend[command_index] != "STOP");
    
    ESP.restart();
   }
 }
 delay(1000);
}
