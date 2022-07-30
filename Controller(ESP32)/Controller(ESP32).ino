/*
 7/22 
 컨트롤러 완료
 
 컨트롤러에서 연결하는 모양대로 번호(ESP32핀)
 1(14) 2(15) 3(25) 4(27)
 5(32) 6(13) 7(33) 8(26)

 동작 방식
 예시)WORK 1 160와 같은 명령을 std::string 형식으로 BLE를 통해 수신
 WORK(동작여부 : 앞 네자리) 1 (모터번호 : 중간 1자리) 160 (서보모터 각도 : 마지막 3자리)
 각 값을 쪼개서 WORK, STOP함수를 호출해서 각 모터 번호와 각도에 따라 동작시킴

 servo는 attach하고 사용 후 detach하지 않으면 각도를 유지하기 위해서 배터리 계속 사용함

 Serial 통신을 하는 부분은 실제 제품에는 사용X
 PC와 통신할때 디버깅 용도이기 때문에 불필요한 내용(동작 확인 후 주석처리해서 업로드 할 것)
 */
 
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <ESP32_Servo.h>

#define servo1Pin 14
#define servo2Pin 15
#define servo3Pin 25
#define servo4Pin 27
#define servo5Pin 32
#define servo6Pin 13
#define servo7Pin 33
#define servo8Pin 26

Servo servo1;
Servo servo2;
Servo servo3;
Servo servo4;
Servo servo5;
Servo servo6;
Servo servo7;
Servo servo8;

BLEServer *pServer = NULL;
BLECharacteristic * pTxCharacteristic;
bool deviceConnected = false;
bool oldDeviceConnected = false;
uint8_t txValue = 0;

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

#define SERVICE_UUID           "6E400001-B5A3-F393-E0A9-E50E24DCCA9E" // UART service UUID
#define CHARACTERISTIC_UUID_RX "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
#define CHARACTERISTIC_UUID_TX "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"

int number = 0;
int angle =0;
std::string behavior;
void Work();
void AllStop();

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
    }
};

class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string rxValue = pCharacteristic->getValue();
      if (rxValue.length() > 0) {
        Serial.println("*********");
        Serial.print("Received Value: ");
        for (int i = 0; i < rxValue.length(); i++)
          Serial.print(rxValue[i]);
          
      number = std::stoi(rxValue.substr(5,1));
      angle = std::stoi(rxValue.substr(7,3));
      behavior = rxValue.substr(0,4);
      /*
      for (int i = 0; i < behavior.length(); i++)
          Serial.print(behavior[i]);
      Serial.println(number);
      Serial.println(angle);  
      */
          if(behavior=="WORK"){
            Work();
          }
          else if(behavior=="STOP"){
            AllStop();
          }
      }
      Serial.println("*********");
    }
};

void Work(){
  switch(number){
    case 1:
     servo1.attach(servo1Pin);
     servo1.write(angle);
     delay(1000);
     servo1.write(0);
     delay(1000);
     servo1.detach();
     break;
    case 2:
     servo2.attach(servo2Pin);
     servo2.write(angle);
     delay(1000);
     servo2.write(0);
     delay(1000);
     servo2.detach();
     break;
    case 3:
     servo3.attach(servo3Pin);
     servo3.write(angle);
     delay(1000);
     servo3.write(0);
     delay(1000);
     servo3.detach();
     break;
    case 4:
     servo4.attach(servo4Pin);
     servo4.write(angle);
     delay(1000);
     servo4.write(0);
     delay(1000);
     servo4.detach();
     break;
    case 5:
     servo5.attach(servo5Pin);
     servo5.write(angle);
     delay(1000);
     servo5.write(0);
     delay(1000);
     servo5.detach();
     break;
    case 6:
     servo6.attach(servo6Pin);
     servo6.write(angle);
     delay(1000);
     servo6.write(0);
     delay(1000);
     servo6.detach();
     break;
    case 7:
     servo7.attach(servo7Pin);
     servo7.write(angle);
     delay(1000);
     servo7.write(0);
     delay(1000);
     servo7.detach();
     break;
    case 8:
     servo8.attach(servo8Pin);
     servo8.write(angle);
     delay(1000);
     servo8.write(0);
     delay(1000);
     servo8.detach();
     break;
  }
}

void AllStop(){
  servo1.detach();
  servo2.detach();
  servo3.detach();
  servo4.detach();
  servo5.detach();
  servo6.detach();
  servo7.detach();
  servo8.detach();
}


void setup() {
  Serial.begin(115200);

  // BLE 장치 시작("")내부는 장치명
  BLEDevice::init("UART Service");

  // BLE Server로 동작
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // BLE 서비스 생성()안에는 UUID필요
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // BLE Characteristic 생성 TX(Notify로 송신 보낼거), RX(수신 받을거)
  pTxCharacteristic = pService->createCharacteristic(
                    CHARACTERISTIC_UUID_TX,
                    BLECharacteristic::PROPERTY_NOTIFY
                  );
                      
  pTxCharacteristic->addDescriptor(new BLE2902());

  BLECharacteristic * pRxCharacteristic = pService->createCharacteristic(
                       CHARACTERISTIC_UUID_RX,
                      BLECharacteristic::PROPERTY_WRITE
                    );

  pRxCharacteristic->setCallbacks(new MyCallbacks());

  // BLE 시작(SETUP 함수에서 실행되므로 장치가 켜지면 BLE도 켜짐)
  pService->start();

  pServer->getAdvertising()->addServiceUUID(SERVICE_UUID);

  // SERVER를 공개
  pServer->getAdvertising()->start();
  Serial.println("Waiting a client connection");
}

void loop() {

    if (deviceConnected) {
        pTxCharacteristic->setValue(&txValue, 0);
        pTxCharacteristic->notify();
        
    delay(100); // 딜레이가 없으면 BLE가 너무 반복되어 먹통
   
  }

    // 연결이 끊어졌을때
    if (!deviceConnected && oldDeviceConnected) {
        delay(500); 
        pServer->startAdvertising(); // SERVER를 다시 공개
        Serial.println("start advertising");
        oldDeviceConnected = deviceConnected;
    }
    // 연결될 때
    if (deviceConnected && !oldDeviceConnected) {
    // do stuff here on connecting
        oldDeviceConnected = deviceConnected;
    }
    delay(1000);
}
