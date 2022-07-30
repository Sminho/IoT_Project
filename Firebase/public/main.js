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


function selected0(){
  var selectedMachine = document.getElementById("machine_list");   
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;  
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;
  
  if(selectText == "가전제품 선택"){
      alert("페이지를 새로고침 합니다.");
      location.reload();
  }
  else{
    $('.Connection_Status').show();
    $('#product-img-div').show();
    $('.product-title').show();
    $('#Btn__list').show();
  }

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
      let Machine_image = doc.data().Machine_image;
      $('.product-img').attr("src", Machine_image);
    
  } else {
      // doc.data() will be undefined in this case
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
  alert(selectText+"의 정보를 불러옵니다.");
  Btn1_count = 0;
  Btn2_count = 0;
  Btn3_count = 0;
  Btn4_count = 0;
  Btn5_count = 0;
  Btn6_count = 0;
  Btn7_count = 0;
  Btn8_count = 0;
}
let command_count = 0;
let last_command = 1;

let Btn1_count = 0;
function control1(){
  Btn1_count+=1;
  command_count+=1;
  last_command+=1;
  document.getElementById("Btn1_count").innerHTML = ` ${Btn1_count} 회`;
  var selectedMachine = document.getElementById("machine_list");   
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;  
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;

  var docRef = db.collection('machine').doc(selectValue);
  docRef.get().then((doc) => {
  if (doc.exists) {
        let Btn1_angle = doc.data().Btn1_angle;
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      let command = 'WORK 1 '+`${Btn1_angle < 100 ? `0${Btn1_angle}` : Btn1_angle}`+' '+Btn1_count+' '+`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      console.log(command);
      var database = firebase.database();
      if(command_count == 1){
        firebase.database().ref(selectValue).set({
          [command_count] : command,
          [last_command] : "STOP"
      });
      }
      else{
        firebase.database().ref(selectValue).update({
          [command_count] : command,
          [last_command] : "STOP"
      });
      }
  } else {
      // doc.data() will be undefined in this case
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}
let Btn2_count = 0;
function control2(){
  Btn2_count+=1;
  command_count+=1;
  last_command+=1;
  document.getElementById("Btn2_count").innerHTML = ` ${Btn2_count} 회`;
  var selectedMachine = document.getElementById("machine_list");   
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;  
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;

  var docRef = db.collection('machine').doc(selectValue);
  docRef.get().then((doc) => {
  if (doc.exists) {
        let Btn2_angle = doc.data().Btn2_angle;
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      let command = 'WORK 2 '+`${Btn2_angle < 100 ? `0${Btn2_angle}` : Btn2_angle}`+' '+Btn2_count+' '+`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      console.log(command);
      var database = firebase.database();
      if(command_count == 1){
        firebase.database().ref(selectValue).set({
          [command_count] : command,
          [last_command] : "STOP"
      });
      }
      else{
        firebase.database().ref(selectValue).update({
          [command_count] : command,
          [last_command] : "STOP"
      });
      }
  } else {
      // doc.data() will be undefined in this case
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}
let Btn3_count = 0;
function control3(){
  Btn3_count+=1;
  command_count+=1;
  last_command+=1;
  document.getElementById("Btn3_count").innerHTML = ` ${Btn3_count} 회`;
  var selectedMachine = document.getElementById("machine_list");   
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;  
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;

  var docRef = db.collection('machine').doc(selectValue);
  docRef.get().then((doc) => {
  if (doc.exists) {
        let Btn3_angle = doc.data().Btn3_angle;
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      let command = 'WORK 3 '+`${Btn3_angle < 100 ? `0${Btn3_angle}` : Btn3_angle}`+' '+Btn3_count+' '+`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      console.log(command);
      var database = firebase.database();
      if(command_count == 1){
        firebase.database().ref(selectValue).set({
          [command_count] : command,
          [last_command] : "STOP"
      });
      }
      else{
        firebase.database().ref(selectValue).update({
          [command_count] : command,
          [last_command] : "STOP"
      });
      }
  } else {
      // doc.data() will be undefined in this case
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}
let Btn4_count = 0;
function control4(){
  Btn4_count+=1;
  command_count+=1;
  last_command+=1;
  document.getElementById("Btn4_count").innerHTML = ` ${Btn4_count} 회`;
  var selectedMachine = document.getElementById("machine_list");   
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;  
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;

  var docRef = db.collection('machine').doc(selectValue);
  docRef.get().then((doc) => {
  if (doc.exists) {
        let Btn4_angle = doc.data().Btn4_angle;
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      let command = 'WORK 4 '+`${Btn4_angle < 100 ? `0${Btn4_angle}` : Btn4_angle}`+' '+Btn4_count+' '+`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      console.log(command);
      var database = firebase.database();
      if(command_count == 1){
        firebase.database().ref(selectValue).set({
          [command_count] : command,
          [last_command] : "STOP"
      });
      }
      else{
        firebase.database().ref(selectValue).update({
          [command_count] : command,
          [last_command] : "STOP"
      });
      }
  } else {
      // doc.data() will be undefined in this case
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}
let Btn5_count = 0;
function control5(){
  Btn5_count+=1;
  command_count+=1;
  last_command+=1;
  document.getElementById("Btn5_count").innerHTML = ` ${Btn5_count} 회`;
  var selectedMachine = document.getElementById("machine_list");   
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;  
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;

  var docRef = db.collection('machine').doc(selectValue);
  docRef.get().then((doc) => {
  if (doc.exists) {
        let Btn5_angle = doc.data().Btn5_angle;
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      let command = 'WORK 5 '+`${Btn5_angle < 100 ? `0${Btn5_angle}` : Btn5_angle}`+' '+Btn5_count+' '+`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      console.log(command);
      var database = firebase.database();
      if(command_count == 1){
        firebase.database().ref(selectValue).set({
          [command_count] : command,
          [last_command] : "STOP"
      });
      }
      else{
        firebase.database().ref(selectValue).update({
          [command_count] : command,
          [last_command] : "STOP"
      });
      }
  } else {
      // doc.data() will be undefined in this case
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}
let Btn6_count = 0;
function control6(){
  Btn6_count+=1;
  command_count+=1;
  last_command+=1;
  document.getElementById("Btn6_count").innerHTML = ` ${Btn6_count} 회`;
  var selectedMachine = document.getElementById("machine_list");   
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;  
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;

  var docRef = db.collection('machine').doc(selectValue);
  docRef.get().then((doc) => {
  if (doc.exists) {
        let Btn6_angle = doc.data().Btn6_angle;
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      let command = 'WORK 6 '+`${Btn6_angle < 100 ? `0${Btn6_angle}` : Btn6_angle}`+' '+Btn6_count+' '+`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      console.log(command);
      var database = firebase.database();
      if(command_count == 1){
        firebase.database().ref(selectValue).set({
          [command_count] : command,
          [last_command] : "STOP"
      });
      }
      else{
        firebase.database().ref(selectValue).update({
          [command_count] : command,
          [last_command] : "STOP"
      });
      }
  } else {
      // doc.data() will be undefined in this case
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}
let Btn7_count = 0;
function control7(){
  Btn7_count+=1;
  command_count+=1;
  last_command+=1;
  document.getElementById("Btn7_count").innerHTML = ` ${Btn7_count} 회`;
  var selectedMachine = document.getElementById("machine_list");   
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;  
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;

  var docRef = db.collection('machine').doc(selectValue);
  docRef.get().then((doc) => {
  if (doc.exists) {
        let Btn7_angle = doc.data().Btn7_angle;
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      let command = 'WORK 7 '+`${Btn7_angle < 100 ? `0${Btn7_angle}` : Btn7_angle}`+' '+Btn7_count+' '+`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      console.log(command);
      var database = firebase.database();
      if(command_count == 1){
        firebase.database().ref(selectValue).set({
          [command_count] : command,
          [last_command] : "STOP"
      });
      }
      else{
        firebase.database().ref(selectValue).update({
          [command_count] : command,
          [last_command] : "STOP"
      });
      }
  } else {
      // doc.data() will be undefined in this case
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}
let Btn8_count = 0;
function control8(){
  Btn8_count+=1;
  command_count+=1;
  last_command+=1;
  document.getElementById("Btn8_count").innerHTML = ` ${Btn8_count} 회`;
  var selectedMachine = document.getElementById("machine_list");   
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;  
  let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;

  var docRef = db.collection('machine').doc(selectValue);
  docRef.get().then((doc) => {
  if (doc.exists) {
        let Btn8_angle = doc.data().Btn8_angle;
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      let command = 'WORK 8 '+`${Btn8_angle < 100 ? `0${Btn8_angle}` : Btn8_angle}`+' '+Btn8_count+' '+`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      console.log(command);
      var database = firebase.database();
      if(command_count == 1){
        firebase.database().ref(selectValue).set({
          [command_count] : command,
          [last_command] : "STOP"
      });
      }
      else{
        firebase.database().ref(selectValue).update({
          [command_count] : command,
          [last_command] : "STOP"
      });
      }
  } else {
      // doc.data() will be undefined in this case
      console.log("Not Exist");
  }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}

/*
--------------------------------------------------------------Setting Page--------------------------------------------------------------
*/
function selected1(){
  var selectedMachine = document.getElementById("ChooseSet");   
  let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;  
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
function selected2(){
    var selectedMachine = document.getElementById("machine_list");   
    let selectValue = selectedMachine.options[selectedMachine.selectedIndex].value;  
    let selectText = selectedMachine.options[selectedMachine.selectedIndex].text;

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
  });

  }
);

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