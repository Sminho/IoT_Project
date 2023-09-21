/*
 * Arduino Uno 동작
 * 터치패널 입력 <-Serial 통신-> ESP32
 * 
 * 웹 연결, BLE 전송등은 모두 ESP32에서 처리
 * Uno는 터치 패널 사용하는 입력장치로만 사용
 */

#include <Adafruit_GFX.h>    // Core graphics library
#include <Adafruit_TFTLCD.h> // Hardware-specific library
#include <TouchScreen.h>
#include <SoftwareSerial.h>
SoftwareSerial soft(12,13); //12 RX 13 TX

// The control pins for the LCD can be assigned to any digital or
// analog pins...but we'll use the analog pins as this allows us to
// double up the pins with the touch screen (see the TFT paint example).
#define LCD_CS A3 // Chip Select goes to Analog 3
#define LCD_CD A2 // Command/Data goes to Analog 2
#define LCD_WR A1 // LCD Write goes to Analog 1
#define LCD_RD A0 // LCD Read goes to Analog 0

#define LCD_RESET A4 // Can alternately just connect to Arduino's reset pin

// When using the BREAKOUT BOARD only, use these 8 data lines to the LCD:
// For the Arduino Uno, Duemilanove, Diecimila, etc.:
//   D0 connects to digital pin 8  (Notice these are
//   D1 connects to digital pin 9   NOT in order!)
//   D2 connects to digital pin 2
//   D3 connects to digital pin 3
//   D4 connects to digital pin 4
//   D5 connects to digital pin 5
//   D6 connects to digital pin 6
//   D7 connects to digital pin 7
// For the Arduino Mega, use digital pins 22 through 29
// (on the 2-row header at the end of the board).

// Assign human-readable names to some common 16-bit color values:
#define  BLACK   0x0000
#define BLUE    0x001F
#define RED     0xF800
#define GREEN   0x07E0
#define CYAN    0x07FF
#define MAGENTA 0xF81F
#define YELLOW  0xFFE0
#define WHITE   0xFFFF

// Color definitions
#define ILI9341_BLACK       0x0000      /*   0,   0,   0 */
#define ILI9341_NAVY        0x000F      /*   0,   0, 128 */
#define ILI9341_DARKGREEN   0x03E0      /*   0, 128,   0 */
#define ILI9341_DARKCYAN    0x03EF      /*   0, 128, 128 */
#define ILI9341_MAROON      0x7800      /* 128,   0,   0 */
#define ILI9341_PURPLE      0x780F      /* 128,   0, 128 */
#define ILI9341_OLIVE       0x7BE0      /* 128, 128,   0 */
#define ILI9341_LIGHTGREY   0xC618      /* 192, 192, 192 */
#define ILI9341_DARKGREY    0x7BEF      /* 128, 128, 128 */
#define ILI9341_BLUE        0x001F      /*   0,   0, 255 */
#define ILI9341_GREEN       0x07E0      /*   0, 255,   0 */
#define ILI9341_CYAN        0x07FF      /*   0, 255, 255 */
#define ILI9341_RED         0xF800      /* 255,   0,   0 */
#define ILI9341_MAGENTA     0xF81F      /* 255,   0, 255 */
#define ILI9341_YELLOW      0xFFE0      /* 255, 255,   0 */
#define ILI9341_WHITE       0xFFFF      /* 255, 255, 255 */
#define ILI9341_ORANGE      0xFD20      /* 255, 165,   0 */
#define ILI9341_GREENYELLOW 0xAFE5      /* 173, 255,  47 */
#define ILI9341_PINK        0xF81F


/******************* UI details */
/*
#define BUTTON_X 50
#define BUTTON_Y 150
#define BUTTON_W 80
#define BUTTON_H 40
#define BUTTON_SPACING_X 30
#define BUTTON_SPACING_Y 30
#define BUTTON_TEXTSIZE 3
// text box where numbers go
#define TEXT_X 10
#define TEXT_Y 10
#define TEXT_W 300
#define TEXT_H 50
#define TEXT_TSIZE 3
#define TEXT_TCOLOR ILI9341_MAGENTA
// the data (phone #) we store in the textfield
#define TEXT_LEN 12
char textfield[TEXT_LEN+1] = "";
uint8_t textfield_i=0;
*/

#define YP A2 //A3  // must be an analog pin, use "An" notation!
#define XM A3 //A2  // must be an analog pin, use "An" notation!
#define YM 8  //9   // can be a digital pin
#define XP 9  //8   // can be a digital pin


//#define TS_MINX 150
//#define TS_MAXX 890

//#define TS_MINY 75
//#define TS_MAXY 935

#define TS_MINX 906
#define TS_MAXX 120

#define TS_MINY 68 
#define TS_MAXY 953

// We have a status line for like, is FONA working
#define STATUS_X 10
#define STATUS_Y 65



#include <MCUFRIEND_kbv.h>
MCUFRIEND_kbv tft;
TouchScreen ts = TouchScreen(XP, YP, XM, YM, 300);
// If using the shield, all control and data lines are fixed, and
// a simpler declaration can optionally be used:
// Adafruit_TFTLCD tft;

Adafruit_GFX_Button buttons[15];
/* create 15 buttons, in classic candybar phone style */
char buttonlabels[15][5] = {"Send", "Clr", "End", "1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#" };
uint16_t buttoncolors[15] = {ILI9341_DARKGREEN, ILI9341_DARKGREY, ILI9341_RED, 
                             ILI9341_BLUE, ILI9341_BLUE, ILI9341_BLUE, 
                             ILI9341_BLUE, ILI9341_BLUE, ILI9341_BLUE, 
                             ILI9341_BLUE, ILI9341_BLUE, ILI9341_BLUE, 
                             ILI9341_ORANGE, ILI9341_BLUE, ILI9341_ORANGE};
                             
void setup(void) {
  Serial.begin(115200);
  soft.begin(115200);
  
  Serial.println(F("TFT LCD test"));

#ifdef USE_ADAFRUIT_SHIELD_PINOUT
  Serial.println(F("Using Adafruit 2.4\" TFT Arduino Shield Pinout"));
#else
  Serial.println(F("Using Adafruit 2.4\" TFT Breakout Board Pinout"));
#endif

  Serial.print("TFT size is "); Serial.print(tft.width()); Serial.print("x"); Serial.println(tft.height());

  tft.reset();
  tft.begin(0x9488);
  tft.fillScreen(WHITE);
  tft.setRotation(3); 
  tft.setTextColor(BLACK);
  tft.setTextSize(3);
  tft.setCursor(8,18);
  tft.println("Machine : Washer    ");

  tft.fillTriangle(430, 50, 430, 10, 470, 30, CYAN);
  //tft.fillTriangle(420, 50, 420, 10, 380, 30, CYAN);
  tft.setTextColor(WHITE);
  tft.setTextSize(2); 
  tft.fillRect(5,65,110,120,BLUE);
  tft.fillRect(125,65,110,120,BLUE);
  tft.fillRect(245,65,110,120,BLUE);
  tft.fillRect(365,65,110,120,BLUE);
  tft.fillRect(5,195,110,120,BLUE);
  tft.fillRect(125,195,110,120,BLUE);
  tft.fillRect(245,195,110,120,BLUE);
  tft.fillRect(365,195,110,120,BLUE);
  tft.setCursor(8,90);
  tft.println("Button 1");
  tft.setCursor(128,90);
  tft.println("Button 2");
  tft.setCursor(248,90);
  tft.println("Button 3");
  tft.setCursor(368,90);
  tft.println("Button 4");
  tft.setCursor(8,225);
  tft.println("Button 5");
  tft.setCursor(128,225);
  tft.println("Button 6");
  tft.setCursor(248,225);
  tft.println("Button 7");
  tft.setCursor(368,225);
  tft.println("Button 8");
  
}

#define MINPRESSURE 10
#define MAXPRESSURE 1000

int Btn1_count = 0;
int Btn2_count = 0;
int Btn3_count = 0;
int Btn4_count = 0;
int Btn5_count = 0;
int Btn6_count = 0;
int Btn7_count = 0;
int Btn8_count = 0;

boolean newData = true;
boolean inputAvailable = false;
boolean initalized = true;
boolean initalizedMachine = true;


void loop(void) {
  /*TSPoint p;
  p = ts.getPoint(); 
  */
  String Input = "";
  
  //digitalWrite(13, HIGH);
  TSPoint p = ts.getPoint();
  //digitalWrite(13, LOW);

  // if sharing pins, you'll need to fix the directions of the touchscreen pins
  //pinMode(XP, OUTPUT);
  pinMode(XM, OUTPUT);
  pinMode(YP, OUTPUT);
  //pinMode(YM, OUTPUT);

  // we have some minimum pressure we consider 'valid'
  // pressure of 0 means no pressing!
  
 // p = ts.getPoint(); 
  /*
  if (ts.bufferSize()) {
    
  } else {
    // this is our way of tracking touch 'release'!
    p.x = p.y = p.z = -1;
  }*/
  
  // Scale from ~0->4000 to tft.width using the calibration #'s
  /*
  if (p.z != -1) {
    p.x = map(p.x, TS_MINX, TS_MAXX, 0, tft.width());
    p.y = map(p.y, TS_MINY, TS_MAXY, 0, tft.height());
    Serial.print("("); Serial.print(p.x); Serial.print(", "); 
    Serial.print(p.y); Serial.print(", "); 
    Serial.print(p.z); Serial.println(") ");
  }*/
   if (p.z > MINPRESSURE && p.z < MAXPRESSURE) {
    // scale from 0->1023 to tft.width
    p.x = map(p.x, TS_MINX, TS_MAXX, tft.width(), 0);
    p.y = (tft.height()-map(p.y, TS_MINY, TS_MAXY, tft.height(), 0));
   }

    if(soft.available() > 0){
      Input = soft.readStringUntil('\n');
      Serial.println(Input);
      Input.trim();

      if(Input == "Available"){
        inputAvailable = true;
        Serial.println(inputAvailable);
      }
      else if(Input == "Not Available"){
        inputAvailable = false;
        Serial.println(inputAvailable);
      }
    }
   
    if(inputAvailable == true){
      boolean initalized = true;

      if(initalizedMachine == true){
        boolean initalizedMachine = false;
        tft.setTextColor(BLACK,WHITE);
        tft.setTextSize(3);
        tft.setCursor(8,18);
        tft.println("Machine : Washer    ");
      }
      
      if( p.x < 280 && p.x > 95 && p.y > 245 && p.y < 315){
         Btn1_count++;
         Input = "Button 1";
         soft.println(Input);
         //Serial.println("sent");
         tft.fillRect(5,65,110,120,CYAN);
         tft.setCursor(8,120);
         tft.setTextColor(WHITE);
         tft.setTextSize(2);
         tft.println("PRESSED");
         delay(300);
         tft.fillRect(5,65,110,120,BLUE);
         tft.setCursor(8,90);  
         tft.println("Button 1");
         tft.setCursor(8,135); 
         tft.print("Count: ");
         tft.println(Btn1_count);
      }
      if( p.x < 280 && p.x > 95 && p.y > 165 && p.y < 235){
         Btn2_count++;
         Input = "Button 2";
         soft.println(Input);
         //Serial.println("sent");
         tft.fillRect(125,65,110,120,CYAN);
         tft.setCursor(128,120);
         tft.setTextColor(WHITE);
         tft.setTextSize(2);
         tft.println("PRESSED");
         delay(300);
         tft.fillRect(125,65,110,120,BLUE);
         tft.setCursor(128,90); 
         tft.println("Button 2");
         tft.setCursor(128,135); 
         tft.print("Count: ");
         tft.println(Btn2_count);
      }
      if( p.x < 280 && p.x > 95 && p.y > 85 && p.y < 155){
         Btn3_count++;
         Input = "Button 3";
         soft.println(Input);
         //Serial.println("sent");
         tft.fillRect(245,65,110,120,CYAN);
         tft.setCursor(248,120);
         tft.setTextColor(WHITE);
         tft.setTextSize(2);
         tft.println("PRESSED");
         delay(300);
         tft.fillRect(245,65,110,120,BLUE);
         tft.setCursor(248,90); 
         tft.println("Button 3");
         tft.setCursor(248,135); 
         tft.print("Count: ");
         tft.println(Btn3_count);
      }
      if( p.x < 280 && p.x > 95 && p.y > 5 && p.y < 75){
         Btn4_count++;
         Input = "Button 4";
         soft.println(Input);
         //Serial.println("sent");
         tft.fillRect(365,65,110,120,CYAN);
         tft.setCursor(368,120);
         tft.setTextColor(WHITE);
         tft.setTextSize(2);
         tft.println("PRESSED");
         delay(300);
         tft.fillRect(365,65,110,120,BLUE);
         tft.setCursor(368,90); 
         tft.println("Button 4");
         tft.setCursor(368,135); 
         tft.print("Count: ");
         tft.println(Btn4_count);
      }
      if( p.x < 475 && p.x > 285 && p.y > 245 && p.y < 315){
         Btn5_count++;
         Input = "Button 5";
         soft.println(Input);
         //Serial.println("sent");
         tft.fillRect(5,195,110,120,CYAN);
         tft.setCursor(8,255);
         tft.setTextColor(WHITE);
         tft.setTextSize(2);
         tft.println("PRESSED");
         delay(300);
         tft.fillRect(5,195,110,120,BLUE);
         tft.setCursor(8,225);
         tft.println("Button 5");
         tft.setCursor(8,270);
         tft.print("Count: ");
         tft.println(Btn5_count);
      }
      if( p.x < 475 && p.x > 285 && p.y > 165 && p.y < 235){
         Btn6_count++;
         Input = "Button 6";
         soft.println(Input);
         //Serial.println("sent");
         tft.fillRect(125,195,110,120,CYAN);
         tft.setCursor(128,255);
         tft.setTextColor(WHITE);
         tft.setTextSize(2);
         tft.println("PRESSED");
         delay(300);
         tft.fillRect(125,195,110,120,BLUE);
         tft.setCursor(128,225);
         tft.println("Button 6");
         tft.setCursor(128,270);
         tft.print("Count: ");
         tft.println(Btn6_count);
      }
      if( p.x < 475 && p.x > 285 && p.y > 85 && p.y < 155){
         Btn7_count++;
         Input = "Button 7";
         soft.println(Input);
         //Serial.println("sent");
         tft.fillRect(245,195,110,120,CYAN);
         tft.setCursor(248,255);
         tft.setTextColor(WHITE);
         tft.setTextSize(2);
         tft.println("PRESSED");
         delay(300);
         tft.fillRect(245,195,110,120,BLUE);
         tft.setCursor(248,225);
         tft.println("Button 7");
         tft.setCursor(248,270);
         tft.print("Count: ");
         tft.println(Btn7_count);
      }
      if( p.x < 475 && p.x > 285 && p.y > 5 && p.y < 75){
         Btn8_count++;
         Input = "Button 8";
         soft.println(Input);
         //Serial.println("sent");
         tft.fillRect(365,195,110,120,CYAN);
         tft.setCursor(368,255);
         tft.setTextColor(WHITE);
         tft.setTextSize(2);
         tft.println("PRESSED");
         delay(300);
         tft.fillRect(365,195,110,120,BLUE);
         tft.setCursor(368,225);
         tft.println("Button 8");
         tft.setCursor(368,270);
         tft.print("Count: ");
         tft.println(Btn8_count);
      }
      if( p.x < 85 && p.x > 5 && p.y > 5 && p.y < 35){
         Btn1_count = 0;
         Btn2_count = 0;
         Btn3_count = 0;
         Btn4_count = 0;
         Btn5_count = 0;
         Btn6_count = 0;
         Btn7_count = 0;
         Btn8_count = 0;
         
         Input = "STOP";
         soft.println(Input);
         //Serial.println("sent");
         tft.fillTriangle(430, 50, 430, 10, 470, 30, YELLOW);
         delay(300);
         tft.fillTriangle(430, 50, 430, 10, 470, 30, CYAN);

         tft.setTextColor(WHITE);
         tft.setTextSize(2);

         tft.fillRect(5,65,110,120,BLUE);
         tft.setCursor(8,90);  
         tft.println("Button 1");
         tft.setCursor(8,135); 
         tft.print("Count: ");
         tft.println(Btn1_count);
         
         tft.fillRect(125,65,110,120,BLUE);
         tft.setCursor(128,90); 
         tft.println("Button 2");
         tft.setCursor(128,135); 
         tft.print("Count: ");
         tft.println(Btn2_count);
         
         tft.fillRect(245,65,110,120,BLUE);
         tft.setCursor(248,90); 
         tft.println("Button 3");
         tft.setCursor(248,135); 
         tft.print("Count: ");
         tft.println(Btn3_count);

         tft.fillRect(365,65,110,120,BLUE);
         tft.setCursor(368,90); 
         tft.println("Button 4");
         tft.setCursor(368,135); 
         tft.print("Count: ");
         tft.println(Btn4_count);

         tft.fillRect(5,195,110,120,BLUE);
         tft.setCursor(8,225);
         tft.println("Button 5");
         tft.setCursor(8,270);
         tft.print("Count: ");
         tft.println(Btn5_count);

         tft.fillRect(125,195,110,120,BLUE);
         tft.setCursor(128,225);
         tft.println("Button 6");
         tft.setCursor(128,270);
         tft.print("Count: ");
         tft.println(Btn6_count);

         tft.fillRect(245,195,110,120,BLUE);
         tft.setCursor(248,225);
         tft.println("Button 7");
         tft.setCursor(248,270);
         tft.print("Count: ");
         tft.println(Btn7_count);

         tft.fillRect(365,195,110,120,BLUE);
         tft.setCursor(368,225);
         tft.println("Button 8");
         tft.setCursor(368,270);
         tft.print("Count: ");
         tft.println(Btn8_count);
      }
    }
    else if(inputAvailable == false){
      boolean initalizedMachine = true;
      if(initalized == true){
        boolean initalized = false;
        tft.setTextColor(BLACK,YELLOW);
        tft.setTextSize(3);
        tft.setCursor(8,18);
        tft.println("   Not Available   ");
      }
    }
   delay(100);

 
}
