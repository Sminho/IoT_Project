/**
 * @author 신민호 <smh9800@g.skku.edu>
 * @file 자바스크립트, Jquery를 사용하여 작성됨
 * @requires firebasejs/8.6.5
 * @requires jquery
 * 
 * 참고사항
 * 
 * control.html에서 Status? 
 * 0은 동작 요청 
 * 1은 장치가 읽는중 
 * 2는 장치 동작 중 
 * 3은 버튼 입력 받는 상태
 * 
 * control, setting.html에서 selectedMachine,Value,Text?
 * 특별한 상황아니면 편의상 내용이 같게함
 * 
 * database = firebase.database();로 들어가는 데이터베이스는 Realtime Database
 * var docRef = db.collection('machine').doc(selectValue); collection 어쩌구 쓰는건 Firestore database
 * 이미지 저장은 Storage
 * 
 * Firebase version 8 문법을 따라서 작성됨(9로 업데이트 하려면 Namespace 방식이라 다 고쳐야함)
 */

const toggleBtn = document.querySelector('.navbar__toggleBtn');
const menu = document.querySelector('.navbar__menu');
const links = document.querySelector('.navbar__links');

toggleBtn.addEventListener('click',()=>{
    menu.classList.toggle('active');
    links.classList.toggle('active');
});

/*
--------------------------------------------------------------Control Page--------------------------------------------------------------
*/

/**
 * 여기에 firebase 설정 값을 넣음 
 * */
var firebaseConfig = {
    apiKey: "AIzaSyBxDKZ3CTf-HJgiSCKcISVCB6h_k66Vuqk",
    authDomain: "iot-project-226cc.firebaseapp.com",
    databaseURL: "https://iot-project-226cc-default-rtdb.firebaseio.com",
    projectId: "iot-project-226cc",
    storageBucket: "iot-project-226cc.appspot.com",
    messagingSenderId: "802971323666",
    appId: "1:802971323666:web:6a6cd8b1f28760354977cb",
    measurementId: "G-19LMKQ1K7H"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

db.collection('machine').get().then((names)=>{
names.forEach((doc)=>{
  let o = document.createElement("option");
      if(doc.id != "mahcine_name") //machine_name은 firestore에서 문서 필드 설정할때만 사용
      {
          o.text = doc.id;
          o.value = doc.id;
          machine_list.appendChild(o);
      }
  });
});

/**
 * select0은 제어페이지에서 가전제품을 선택하는 박스입니다.
 * 가전제품을 선택하면, 버튼들에 설정했던 이름을 씌우는 함수
*/
function selected0(){
  var selectedMachine = document.getElementById("machine_list");  
  /**selectValue 선택박스에서 Value, 그냥 Javascript 형식으로 따옴 */
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;
  /**selectValue 선택박스에서 Text, 그냥 Javascript 형식으로 따옴 */
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;
  
  if(selectText == "가전제품 선택"){
      alert("페이지를 새로고침 합니다.");
      location.reload();
  }
  else{ //원래는 select0 말고는 표시 안하는 상태->선택을 했으니 정보를 표시
    $('.Connection_Status').show();
    $('#product-img-div').show();
    $('.product-title').show();
    $('#Btn__list').show();
    $('.work_Btn').show();
  }

  /**
   * firestore database는 collection->document->field로 경로가 있는데
   * machine이라는 collection에 selectValue로 각각 가전제품의 document를 찾아서 값을 가져오는 기능 
   */
  var docRef = db.collection('machine').doc(selectValue);
  docRef.get().then((doc) => {
  if (doc.exists) {
      let Btn1_name = doc.data().Btn1_name;
      $('#motor1').val(Btn1_name);
      let Btn2_name = doc.data().Btn2_name;
      $('#motor2').val(Btn2_name);
      let Btn3_name = doc.data().Btn3_name;
      $('#motor3').val(Btn3_name);
      let Btn4_name = doc.data().Btn4_name;
      $('#motor4').val(Btn4_name);
      let Btn5_name = doc.data().Btn5_name;
      $('#motor5').val(Btn5_name);
      let Btn6_name = doc.data().Btn6_name;
      $('#motor6').val(Btn6_name);
      let Btn7_name = doc.data().Btn7_name;
      $('#motor7').val(Btn7_name);
      let Btn8_name = doc.data().Btn8_name;
      $('#motor8').val(Btn8_name);
      let Btn9_name = doc.data().Btn9_name;

      if(Btn9_name == 1){
        $('#Dial__list').show();
        $('#Btn9_count').show();
      }
      else{
        $('#Dial__list').hide();;
        $('#Btn9_count').hide();
      }
      let Machine_image = doc.data().Machine_image;
      $('.product-img').attr("src", Machine_image);
    
  } else {
      // doc.data()가 없는 경우, 이건 select0에 임의로 옵션 추가한 경우 아니면 볼일이 없다.
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
  alert(selectText+"의 정보를 불러옵니다.");

  // 각 버튼의 누른 횟수를 일단 가전제품을 불러온 순간 모두 0으로 보이도록 함
  Btn1_count = 0;
  Btn2_count = 0;
  Btn3_count = 0;
  Btn4_count = 0;
  Btn5_count = 0;
  Btn6_count = 0;
  Btn7_count = 0;
  Btn8_count = 0;
}
/**
* 버튼을 누른 횟수를 세는 변수인데, 이걸 이용해서 realtime database에 1,2,3,4와 같이 순서대로 명령이 추가되게함
*/
let command_count = 0;
/**
* command_count보다 1씩 큰 변수, realtime database에 command 다음 숫자 번호에 STOP이 추가되도록 함
*/
let last_command = 1;

/**
* 제어 페이지에서 버튼 1의 누른 횟수
*/
let Btn1_count = 0;
/**
* 제어페이지에서 버튼 1을 눌렀을 때 실행하는 기능, 매개변수는 없지만 버튼을 누르면 firebase의 realtime database에 동작 명령을 하나씩 추가함
*/
function control1(){
  Btn1_count+=1;
  command_count+=1;
  last_command+=1;
  document.getElementById("Btn1_count").innerHTML = ` ${Btn1_count} 회`;
  var selectedMachine = document.getElementById("machine_list");   
  /**selectValue 선택박스에서 Value, 그냥 Javascript 형식으로 따옴 */
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;
  /**selectValue 선택박스에서 Text, 그냥 Javascript 형식으로 따옴 */
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;
  let UsageRef = selectValue+'Usage';

  var docRef = db.collection('machine').doc(selectValue);
  docRef.get().then((doc) => {
  if (doc.exists) {
      let Btn1_angle = doc.data().Btn1_angle;
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      //var week = ['일', '월', '화', '수', '목', '금', '토'];
      //console.log( week[time.getDay()] + '요일' );
      /**
      * command의 형식은 WORK (모터 번호) (모터 각도 = 누르는 강도) (횟수) (시간)
      */
      let command = 'WORK 1 '+`${Btn1_angle < 100 ? `0${Btn1_angle}` : Btn1_angle}`+' '+Btn1_count+' '+`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      console.log(command);
      var database = firebase.database();
      /**
       * command_count를 이용해 command 다음 문장에 STOP이 하나씩 추가 되도록 만들어진 조건문
       */
      if(command_count == 1){
        firebase.database().ref(selectValue).set({
          [command_count] : command,
          [last_command] : "STOP",
          Status : 3
      });
      }
      else{
        firebase.database().ref(selectValue).update({
          [command_count] : command,
          [last_command] : "STOP",
          Status : 3
      });
      }
      let today = time.getDay();
      firebase.database().ref(UsageRef).get().then((snapshot) => {
				if (snapshot.exists()) {
				Usage = snapshot.val()[today];
				console.log(Usage);
          firebase.database().ref(UsageRef).update({
            [time.getDay()] : Usage +  1,
        });
				}
        else{
          firebase.database().ref(UsageRef).set({
            [time.getDay()] : Btn1_count,
        });
        }
      });
    
  } else {
     // doc.data()가 없는 경우, 이건 select0에 임의로 옵션 추가한 경우 아니면 볼일이 없다.
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}

/**
* 제어 페이지에서 버튼 2의 누른 횟수
*/
let Btn2_count = 0;
/**
* 제어페이지에서 버튼 2을 눌렀을 때 실행하는 기능, 매개변수는 없지만 버튼을 누르면 firebase의 realtime database에 동작 명령을 하나씩 추가함
*/
function control2(){
  Btn2_count+=1;
  command_count+=1;
  last_command+=1;
  document.getElementById("Btn2_count").innerHTML = ` ${Btn2_count} 회`;
  var selectedMachine = document.getElementById("machine_list");   
  /**selectValue 선택박스에서 Value, 그냥 Javascript 형식으로 따옴 */
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;
  /**selectValue 선택박스에서 Text, 그냥 Javascript 형식으로 따옴 */
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;

  var docRef = db.collection('machine').doc(selectValue);
  docRef.get().then((doc) => {
  if (doc.exists) {
        let Btn2_angle = doc.data().Btn2_angle;
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
       /**
      * command의 형식은 WORK (모터 번호) (모터 각도 = 누르는 강도) (횟수) (시간)
      */
      let command = 'WORK 2 '+`${Btn2_angle < 100 ? `0${Btn2_angle}` : Btn2_angle}`+' '+Btn2_count+' '+`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      console.log(command);
      var database = firebase.database();
      /**
       * command_count를 이용해 command 다음 문장에 STOP이 하나씩 추가 되도록 만들어진 조건문
       */
      if(command_count == 1){
        firebase.database().ref(selectValue).set({
          [command_count] : command,
          [last_command] : "STOP",
          Status : 3
      });
      }
      else{
        firebase.database().ref(selectValue).update({
          [command_count] : command,
          [last_command] : "STOP",
          Status : 3
      });
      }
  } else {
      // doc.data()가 없는 경우, 이건 select0에 임의로 옵션 추가한 경우 아니면 볼일이 없다.
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}

/**
* 제어 페이지에서 버튼 3의 누른 횟수
*/
let Btn3_count = 0;
/**
* 제어페이지에서 버튼 3을 눌렀을 때 실행하는 기능, 매개변수는 없지만 버튼을 누르면 firebase의 realtime database에 동작 명령을 하나씩 추가함
*/
function control3(){
  Btn3_count+=1;
  command_count+=1;
  last_command+=1;
  document.getElementById("Btn3_count").innerHTML = ` ${Btn3_count} 회`;
  var selectedMachine = document.getElementById("machine_list");   
 /**selectValue 선택박스에서 Value, 그냥 Javascript 형식으로 따옴 */
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;
  /**selectValue 선택박스에서 Text, 그냥 Javascript 형식으로 따옴 */
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;

  var docRef = db.collection('machine').doc(selectValue);
  docRef.get().then((doc) => {
  if (doc.exists) {
        let Btn3_angle = doc.data().Btn3_angle;
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
       /**
      * command의 형식은 WORK (모터 번호) (모터 각도 = 누르는 강도) (횟수) (시간)
      */
      let command = 'WORK 3 '+`${Btn3_angle < 100 ? `0${Btn3_angle}` : Btn3_angle}`+' '+Btn3_count+' '+`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      console.log(command);
      var database = firebase.database();
      /**
       * command_count를 이용해 command 다음 문장에 STOP이 하나씩 추가 되도록 만들어진 조건문
       */
      if(command_count == 1){
        firebase.database().ref(selectValue).set({
          [command_count] : command,
          [last_command] : "STOP",
          Status : 3
      });
      }
      else{
        firebase.database().ref(selectValue).update({
          [command_count] : command,
          [last_command] : "STOP",
          Status : 3
      });
      }
  } else {
      // doc.data()가 없는 경우, 이건 select0에 임의로 옵션 추가한 경우 아니면 볼일이 없다.
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}

/**
* 제어 페이지에서 버튼 4의 누른 횟수
*/
let Btn4_count = 0;
/**
* 제어페이지에서 버튼 4을 눌렀을 때 실행하는 기능, 매개변수는 없지만 버튼을 누르면 firebase의 realtime database에 동작 명령을 하나씩 추가함
*/
function control4(){
  Btn4_count+=1;
  command_count+=1;
  last_command+=1;
  document.getElementById("Btn4_count").innerHTML = ` ${Btn4_count} 회`;
  var selectedMachine = document.getElementById("machine_list");   
  /**selectValue 선택박스에서 Value, 그냥 Javascript 형식으로 따옴 */
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;
  /**selectValue 선택박스에서 Text, 그냥 Javascript 형식으로 따옴 */
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;

  var docRef = db.collection('machine').doc(selectValue);
  docRef.get().then((doc) => {
  if (doc.exists) {
        let Btn4_angle = doc.data().Btn4_angle;
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      /**
      * command의 형식은 WORK (모터 번호) (모터 각도 = 누르는 강도) (횟수) (시간)
      */
      let command = 'WORK 4 '+`${Btn4_angle < 100 ? `0${Btn4_angle}` : Btn4_angle}`+' '+Btn4_count+' '+`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      console.log(command);
      var database = firebase.database();
      /**
       * command_count를 이용해 command 다음 문장에 STOP이 하나씩 추가 되도록 만들어진 조건문
       */
      if(command_count == 1){
        firebase.database().ref(selectValue).set({
          [command_count] : command,
          [last_command] : "STOP",
          Status : 3
      });
      }
      else{
        firebase.database().ref(selectValue).update({
          [command_count] : command,
          [last_command] : "STOP",
          Status : 3
      });
      }
  } else {
      // doc.data()가 없는 경우, 이건 select0에 임의로 옵션 추가한 경우 아니면 볼일이 없다.
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}

/**
* 제어 페이지에서 버튼 5의 누른 횟수
*/
let Btn5_count = 0;
/**
* 제어페이지에서 버튼 5을 눌렀을 때 실행하는 기능, 매개변수는 없지만 버튼을 누르면 firebase의 realtime database에 동작 명령을 하나씩 추가함
*/
function control5(){
  Btn5_count+=1;
  command_count+=1;
  last_command+=1;
  document.getElementById("Btn5_count").innerHTML = ` ${Btn5_count} 회`;
  var selectedMachine = document.getElementById("machine_list");   
  /**selectValue 선택박스에서 Value, 그냥 Javascript 형식으로 따옴 */
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;
  /**selectValue 선택박스에서 Text, 그냥 Javascript 형식으로 따옴 */
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;

  var docRef = db.collection('machine').doc(selectValue);
  docRef.get().then((doc) => {
  if (doc.exists) {
        let Btn5_angle = doc.data().Btn5_angle;
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      /**
      * command의 형식은 WORK (모터 번호) (모터 각도 = 누르는 강도) (횟수) (시간)
      */
      let command = 'WORK 5 '+`${Btn5_angle < 100 ? `0${Btn5_angle}` : Btn5_angle}`+' '+Btn5_count+' '+`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      console.log(command);
      var database = firebase.database();
      /**
       * command_count를 이용해 command 다음 문장에 STOP이 하나씩 추가 되도록 만들어진 조건문
       */
      if(command_count == 1){
        firebase.database().ref(selectValue).set({
          [command_count] : command,
          [last_command] : "STOP",
          Status : 3
      });
      }
      else{
        firebase.database().ref(selectValue).update({
          [command_count] : command,
          [last_command] : "STOP",
          Status : 3
      });
      }
  } else {
      // doc.data()가 없는 경우, 이건 select0에 임의로 옵션 추가한 경우 아니면 볼일이 없다.
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}

/**
* 제어 페이지에서 버튼 6의 누른 횟수
*/
let Btn6_count = 0;
/**
* 제어페이지에서 버튼 6을 눌렀을 때 실행하는 기능, 매개변수는 없지만 버튼을 누르면 firebase의 realtime database에 동작 명령을 하나씩 추가함
*/
function control6(){
  Btn6_count+=1;
  command_count+=1;
  last_command+=1;
  document.getElementById("Btn6_count").innerHTML = ` ${Btn6_count} 회`;
  var selectedMachine = document.getElementById("machine_list");   
  /**selectValue 선택박스에서 Value, 그냥 Javascript 형식으로 따옴 */
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;
  /**selectValue 선택박스에서 Text, 그냥 Javascript 형식으로 따옴 */
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;

  var docRef = db.collection('machine').doc(selectValue);
  docRef.get().then((doc) => {
  if (doc.exists) {
        let Btn6_angle = doc.data().Btn6_angle;
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      /**
      * command의 형식은 WORK (모터 번호) (모터 각도 = 누르는 강도) (횟수) (시간)
      */
      let command = 'WORK 6 '+`${Btn6_angle < 100 ? `0${Btn6_angle}` : Btn6_angle}`+' '+Btn6_count+' '+`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      console.log(command);
      var database = firebase.database();
      /**
       * command_count를 이용해 command 다음 문장에 STOP이 하나씩 추가 되도록 만들어진 조건문
       */
      if(command_count == 1){
        firebase.database().ref(selectValue).set({
          [command_count] : command,
          [last_command] : "STOP",
          Status : 3
      });
      }
      else{
        firebase.database().ref(selectValue).update({
          [command_count] : command,
          [last_command] : "STOP",
          Status : 3
      });
      }
  } else {
      // doc.data()가 없는 경우, 이건 select0에 임의로 옵션 추가한 경우 아니면 볼일이 없다.
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}

/**
* 제어 페이지에서 버튼 7의 누른 횟수
*/
let Btn7_count = 0;
/**
* 제어페이지에서 버튼 7을 눌렀을 때 실행하는 기능, 매개변수는 없지만 버튼을 누르면 firebase의 realtime database에 동작 명령을 하나씩 추가함
*/
function control7(){
  Btn7_count+=1;
  command_count+=1;
  last_command+=1;
  document.getElementById("Btn7_count").innerHTML = ` ${Btn7_count} 회`;
  var selectedMachine = document.getElementById("machine_list");   
  /**selectValue 선택박스에서 Value, 그냥 Javascript 형식으로 따옴 */
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;
  /**selectValue 선택박스에서 Text, 그냥 Javascript 형식으로 따옴 */
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;

  var docRef = db.collection('machine').doc(selectValue);
  docRef.get().then((doc) => {
  if (doc.exists) {
        let Btn7_angle = doc.data().Btn7_angle;
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
     /**
      * command의 형식은 WORK (모터 번호) (모터 각도 = 누르는 강도) (횟수) (시간)
      */
      let command = 'WORK 7 '+`${Btn7_angle < 100 ? `0${Btn7_angle}` : Btn7_angle}`+' '+Btn7_count+' '+`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      console.log(command);
      var database = firebase.database();
      /**
       * command_count를 이용해 command 다음 문장에 STOP이 하나씩 추가 되도록 만들어진 조건문
       */
      if(command_count == 1){
        firebase.database().ref(selectValue).set({
          [command_count] : command,
          [last_command] : "STOP",
          Status : 3
      });
      }
      else{
        firebase.database().ref(selectValue).update({
          [command_count] : command,
          [last_command] : "STOP",
          Status : 3
      });
      }
  } else {
      // doc.data()가 없는 경우, 이건 select0에 임의로 옵션 추가한 경우 아니면 볼일이 없다.
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}

/**
* 제어 페이지에서 버튼 8의 누른 횟수
*/
let Btn8_count = 0;
/**
* 제어페이지에서 버튼 8을 눌렀을 때 실행하는 기능, 매개변수는 없지만 버튼을 누르면 firebase의 realtime database에 동작 명령을 하나씩 추가함
*/
function control8(){
  Btn8_count+=1;
  command_count+=1;
  last_command+=1;
  document.getElementById("Btn8_count").innerHTML = ` ${Btn8_count} 회`;
  var selectedMachine = document.getElementById("machine_list");   
  /**selectValue 선택박스에서 Value, 그냥 Javascript 형식으로 따옴 */
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;
  /**selectValue 선택박스에서 Text, 그냥 Javascript 형식으로 따옴 */
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;

  var docRef = db.collection('machine').doc(selectValue);
  docRef.get().then((doc) => {
  if (doc.exists) {
        let Btn8_angle = doc.data().Btn8_angle;
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      /**
      * command의 형식은 WORK (모터 번호) (모터 각도 = 누르는 강도) (횟수) (시간)
      */
      let command = 'WORK 8 '+`${Btn8_angle < 100 ? `0${Btn8_angle}` : Btn8_angle}`+' '+Btn8_count+' '+`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      console.log(command);
      var database = firebase.database();
      /**
       * command_count를 이용해 command 다음 문장에 STOP이 하나씩 추가 되도록 만들어진 조건문
       */
      if(command_count == 1){
        firebase.database().ref(selectValue).set({
          [command_count] : command,
          [last_command] : "STOP",
          Status : 3
      });
      }
      else{
        firebase.database().ref(selectValue).update({
          [command_count] : command,
          [last_command] : "STOP",
          Status : 3
      });
      }
  } else {
      // doc.data()가 없는 경우, 이건 select0에 임의로 옵션 추가한 경우 아니면 볼일이 없다.
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}

/**
* 제어 페이지에서 버튼 8의 누른 횟수
*/
let Btn9_count = 0;
/**
* 제어페이지에서 버튼 8을 눌렀을 때 실행하는 기능, 매개변수는 없지만 버튼을 누르면 firebase의 realtime database에 동작 명령을 하나씩 추가함
*/

var rotateContainer = document.getElementById('rotate-container');
var rotateImage = document.getElementById('rotate-image');
var zeroDegree = -90;
var angle = 0;

rotateContainer.addEventListener('click', function(e) {
  var rect = rotateContainer.getBoundingClientRect();
  var centerX = rect.left + rect.width / 2;
  var centerY = rect.top + rect.height / 2;
  var deltaX = e.clientX - centerX;
  var deltaY = e.clientY - centerY;
  angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
  angle -= zeroDegree;
  if (angle < 0) {
    angle += 360;
  }
  rotateImage.style.transform = 'rotate(' + angle + 'deg)';
  console.log(angle % 360);
});

rotateContainer.addEventListener('touchstart', function(e) {
  var rect = rotateContainer.getBoundingClientRect();
  var centerX = rect.left + rect.width / 2;
  var centerY = rect.top + rect.height / 2;
  var touchX = e.touches[0].clientX;
  var touchY = e.touches[0].clientY;
  var deltaX = touchX - centerX;
  var deltaY = touchY - centerY;
  angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
  angle -= zeroDegree;
  if (angle < 0) {
    angle += 360;
  }
  rotateImage.style.transform = 'rotate(' + angle + 'deg)';
});

rotateContainer.addEventListener('touchmove', function(e) {
  e.preventDefault();
  var rect = rotateContainer.getBoundingClientRect();
  var centerX = rect.left + rect.width / 2;
  var centerY = rect.top + rect.height / 2;
  var touchX = e.touches[0].clientX;
  var touchY = e.touches[0].clientY;
  var deltaX = touchX - centerX;
  var deltaY = touchY - centerY;
  var newAngle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
  newAngle -= zeroDegree;
  if (newAngle < 0) {
    newAngle += 360;
  }
  var deltaAngle = newAngle - angle;
  angle = newAngle;
  var currentRotation = parseInt(rotateImage.style.transform.slice(7));
  rotateImage.style.transform = 'rotate(' + (currentRotation + deltaAngle) + 'deg)';
});

rotateContainer.addEventListener('touchend', function(e) {
  console.log(angle % 360);
});

function control9(){
  Btn9_count+=1;
  command_count+=1;
  last_command+=1;
  //document.getElementById("Btn9_count").innerHTML = ` ${Btn9_count} 회`;
  var selectedMachine = document.getElementById("machine_list");   
  /**selectValue 선택박스에서 Value, 그냥 Javascript 형식으로 따옴 */
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;
  /**selectValue 선택박스에서 Text, 그냥 Javascript 형식으로 따옴 */
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;

  let Btn9_angle = Math.round(angle % 360);
  //console.log(Btn9_angle);

  var docRef = db.collection('machine').doc(selectValue);
  docRef.get().then((doc) => {
  if (doc.exists) {
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      /**
      * command의 형식은 WORK (모터 번호) (모터 각도 = 누르는 강도) (횟수) (시간)
      */
      let command = 'STEP 1 '+`${Btn9_angle < 100 ? `0${Btn9_angle}` : Btn9_angle}`+' '+Btn9_count+' '+`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      console.log(command);
      var database = firebase.database();
      /**
       * command_count를 이용해 command 다음 문장에 STOP이 하나씩 추가 되도록 만들어진 조건문
       */
      if(command_count == 1){
        firebase.database().ref(selectValue).set({
          [command_count] : command,
          [last_command] : "STOP",
          Status : 0
      });
      }
      else{
        firebase.database().ref(selectValue).update({
          [command_count] : command,
          [last_command] : "STOP",
          Status : 0
      });
      }
  } else {
      // doc.data()가 없는 경우, 이건 select0에 임의로 옵션 추가한 경우 아니면 볼일이 없다.
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}



/*
--------------------------------------------------------------Setting Page--------------------------------------------------------------
*/

/**
* 설정 페이지에서 설정할 기능을 선택하면 그에 맞는 입력창들을 표시해주는 함수
*/
$('#Dial').click(function(){
  $('#motor7_name').val("Dial");
  $('#motor7_name').hide();
  $('#motor7_angle').hide();
  $('#motor8_name').hide();
  $('#motor8_angle').hide();
});
function selected1(){
  var selectedMachine = document.getElementById("ChooseSet");   
  /**selectValue 선택박스에서 Value, 그냥 Javascript 형식으로 따옴 */
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;
  /**selectValue 선택박스에서 Text, 그냥 Javascript 형식으로 따옴 */
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;
  if(selectValue == "장치"){
    $('.Btn_set0').show();
	$('.device').show();
	$('.Input__list').show();
    $('.Btn_set1').hide();
    $('.device1').hide();
    $('.Reservation__Input__list').hide();
  }
  else if(selectValue == "예약"){
    $('.Btn_set0').hide();
	$('.device').hide();
	$('.Input__list').hide();
    $('.Btn_set1').show();
    $('.device1').show();
    $('.Reservation__Input__list').show();
  }
  else{
    $('.Btn_set0').hide();
    $('.Btn_set1').hide();
	$('.device').hide();
    $('.device1').hide();
	$('.Input__list').hide();
    $('.Reservation__Input__list').hide();
  }
}

/**
* 설정 페이지에서 예약을 설정할 때 firestore database에 있는 가전제품 버튼 이름을 가져오는 함수
*/
function selected2(){
    var selectedMachine = document.getElementById("machine_list");   
    /**selectValue 선택박스에서 Value, 그냥 Javascript 형식으로 따옴 */
    let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;
    /**selectValue 선택박스에서 Text, 그냥 Javascript 형식으로 따옴 */
    let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;

  /**
   * firestore database는 collection->document->field로 경로가 있는데
   * machine이라는 collection에 selectValue로 각각 가전제품의 document를 찾아서 값을 가져오는 기능 
   */
    var docRef = db.collection('machine').doc(selectValue);
    docRef.get().then((doc) => {
    if (doc.exists) {
        let Btn1_name = doc.data().Btn1_name;
        document.getElementById("Btn1_name").innerHTML = `${Btn1_name} 횟수 : `;
        document.getElementById("Btn11_name").innerHTML = `${Btn1_name} 순서 : `;
        let Btn2_name = doc.data().Btn2_name;
        document.getElementById("Btn2_name").innerHTML = `${Btn2_name} 횟수 : `;
        document.getElementById("Btn22_name").innerHTML = `${Btn2_name} 순서 : `;
        let Btn3_name = doc.data().Btn3_name;
        document.getElementById("Btn3_name").innerHTML = `${Btn3_name} 횟수 : `;
        document.getElementById("Btn33_name").innerHTML = `${Btn3_name} 순서 : `;
        let Btn4_name = doc.data().Btn4_name;
        document.getElementById("Btn4_name").innerHTML = `${Btn4_name} 횟수 : `;
        document.getElementById("Btn44_name").innerHTML = `${Btn4_name} 순서 : `;
        let Btn5_name = doc.data().Btn5_name;
        document.getElementById("Btn5_name").innerHTML = `${Btn5_name} 횟수 : `;
        document.getElementById("Btn55_name").innerHTML = `${Btn5_name} 순서 : `;
        let Btn6_name = doc.data().Btn6_name;
        document.getElementById("Btn6_name").innerHTML = `${Btn6_name} 횟수 : `;
        document.getElementById("Btn66_name").innerHTML = `${Btn6_name} 순서 : `;
        let Btn7_name = doc.data().Btn7_name;
        document.getElementById("Btn7_name").innerHTML = `${Btn7_name} 횟수 : `;
        document.getElementById("Btn77_name").innerHTML = `${Btn7_name} 순서 : `;
        let Btn8_name = doc.data().Btn8_name;
        document.getElementById("Btn8_name").innerHTML = `${Btn8_name} 횟수 : `;
        document.getElementById("Btn88_name").innerHTML = `${Btn8_name} 순서 : `;      
    } else {
        // doc.data() will be undefined in this case
        console.log("Not Exist");
    }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    alert(selectText+"의 정보를 불러옵니다.");
}

/**
* 설정 페이지에서 장치를 설정하는 내용을 입력하고, 설정 버튼을 눌렀을 때 firestore database에 저장하는 함수
*/
var dialCheck = 0;
$('#Dial').click(function(){
  dialCheck = 1;
});
$('#Btn_set0').click(function(){
	var file = document.querySelector('#image').files[0];
	var storageRef = storage.ref();
	var 저장할경로 = storageRef.child('image/' + $('#machine_name').val());
	var 업로드작업 = 저장할경로.put(file)

	업로드작업.on( 'state_changed', 
    // 변화시 동작하는 함수 
    null, 
    //에러시 동작하는 함수
    (error) => {
      console.error('실패사유는', error);
    }, 
    // 성공시 동작하는 함수
    () => {
      업로드작업.snapshot.ref.getDownloadURL().then((url) => {
		var setting = { 
    	Btn1_angle : $('#motor1_angle').val(),
    	Btn1_name : $('#motor1_name').val(),
		Btn2_angle : $('#motor2_angle').val(),
    	Btn2_name : $('#motor2_name').val(),
		Btn3_angle : $('#motor3_angle').val(),
    	Btn3_name : $('#motor3_name').val(),
		Btn4_angle : $('#motor4_angle').val(),
    	Btn4_name : $('#motor4_name').val(),
		Btn5_angle : $('#motor5_angle').val(),
    	Btn5_name : $('#motor5_name').val(),
		Btn6_angle : $('#motor6_angle').val(),
    	Btn6_name : $('#motor6_name').val(),
		Btn7_angle : $('#motor7_angle').val(),
    	Btn7_name : $('#motor7_name').val(),
		Btn8_angle : $('#motor8_angle').val(),
    	Btn8_name : $('#motor8_name').val(),
      Btn9_name : dialCheck,
		Machine_image : url,
  	}
  		db.collection('machine').doc($('#machine_name').val()).set(setting,{merge: true}).then((result)=>{
	alert('장치를 성공적으로 저장했습니다.');
  }).catch((error)=>{
    alert('장치 저장에 실패하였습니다.');
  	})
	});
      });
  var database = firebase.database();
  let RTDBref = $('#machine_name').val()+'Info';

  firebase.database().ref(RTDBref).set({
    1 : 'WORK 1 '+$('#motor1_angle').val(),
    2 : 'WORK 2 '+$('#motor2_angle').val(),
    3 : 'WORK 3 '+$('#motor3_angle').val(),
    4 : 'WORK 4 '+$('#motor4_angle').val(),
    5 : 'WORK 5 '+$('#motor5_angle').val(),
    6 : 'WORK 6 '+$('#motor6_angle').val(),
    7 : 'WORK 7 '+$('#motor7_angle').val(),
    8 : 'WORK 8 '+$('#motor8_angle').val(),
    power : $('#power_consume').val(),
  });

  }
);

/**
* 설정 페이지에서 장치 동작을 예약하는 내용을 입력하고, 설정 버튼을 눌렀을 때 realtime database에 저장하는 함수
*/
$('#Btn_set1').click(function(){
  var selectedMachine = document.getElementById("machine_list");   
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;  
  let ReservationRef = selectValue+'Reservation';

  var database = firebase.database();
	firebase.database().ref(ReservationRef).set({
    ReservationTime : $('#ReservationTime').val(),
    Moter1Count : $('#Reservation_motor1_count').val(),
    Moter1Order : $('#Reservation_motor1_order').val(),
    Moter2Count : $('#Reservation_motor2_count').val(),
    Moter2Order : $('#Reservation_motor2_order').val(),
    Moter3Count : $('#Reservation_motor3_count').val(),
    Moter3Order : $('#Reservation_motor3_order').val(),
    Moter4Count : $('#Reservation_motor4_count').val(),
    Moter4Order : $('#Reservation_motor4_order').val(),
    Moter5Count : $('#Reservation_motor5_count').val(),
    Moter5Order : $('#Reservation_motor5_order').val(),
    Moter6Count : $('#Reservation_motor6_count').val(),
    Moter6Order : $('#Reservation_motor6_order').val(),
    Moter7Count : $('#Reservation_motor7_count').val(),
    Moter7Order : $('#Reservation_motor7_order').val(),
    Moter8Count : $('#Reservation_motor8_count').val(),
    Moter8Order : $('#Reservation_motor8_order').val(),
  });
  alert('에약 정보를 저장했습니다.');
});

/*
--------------------------------------------------------------Monitor Page--------------------------------------------------------------
*/

function selected2(){
  var selectedMachine = document.getElementById("machine_list");  
  /**selectValue 선택박스에서 Value, 그냥 Javascript 형식으로 따옴 */
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;
  /**selectValue 선택박스에서 Text, 그냥 Javascript 형식으로 따옴 */
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;
  let UsageRef = selectValue+'Usage';
  let InfoRef = selectValue+'Info';
  let power;
  let data;
  let data2;

  firebase.database().ref(UsageRef).get().then((snapshot) => {
    if (snapshot.exists()) {
    let Usage1 = snapshot.val()["1"];
    let Usage2 = snapshot.val()["2"];
    let Usage3 = snapshot.val()["3"];
    let Usage4 = snapshot.val()["4"];
    let Usage5 = snapshot.val()["5"];
    let Usage6 = snapshot.val()["6"];
    let Usage7 = snapshot.val()["7"];
    data = [Usage1, Usage2, Usage3, Usage4, Usage5, Usage6, Usage7];

    firebase.database().ref(InfoRef).get().then((snapshot) => {
      if (snapshot.exists()){
        power = snapshot.val()["power"];
        data2 = [Usage1*power, Usage2*power, Usage3*power, Usage4*power, Usage5*power, Usage6*power, Usage7*power];
        document.getElementById("Watt").innerHTML = (Usage1+Usage2+Usage3+Usage4+Usage5+Usage6+Usage7)*power+"W";

         //차트에 data를 let data로 설정
        var ctx = document.getElementById('myChart1').getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['월', '화', '수', '목', '금', '토', '일'],
            datasets: [{
              label: '전력량[W]',
              data: data2,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }});

  document.getElementById("Work_count").innerHTML = (Usage1+Usage2+Usage3+Usage4+Usage5+Usage6+Usage7)+"회";
  var ctx2 = document.getElementById('myChart2').getContext('2d');
  var myChart = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: ['월', '화', '수', '목', '금', '토', '일'],
      datasets: [{
        label: '사용 횟수',
        data: data,
        backgroundColor: ["#416389", "#416389","#416389","#416389","#416389","#416389","#416389"],					
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
    console.log(data);
  } 
  else {
    alert("불러올 데이터가 없습니다. 페이지를 다시 불러옵니다.");
    location.reload();
  }
  });

  
  
  if(selectText == "가전제품 선택"){
      alert("페이지를 새로고침 합니다.");
      location.reload();
  }
  else{ //원래는 선택창 말고는 표시 안하는 상태->선택을 했으니 정보를 표시
    $('.graph').show();
  }
  alert(selectText+"의 정보를 불러옵니다.");
}