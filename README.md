# IoT_Project
구형가전제품에 IoT 기술을 활용하여 다양한 Application을 만들어내기 위한 프로젝트입니다.

연구설명(ITRC 인재양성대전 내용)
-
![전시2](https://github.com/Sminho/IoT_Project/assets/13104540/36576742-73eb-4972-aee8-9c61a301c1a7)
![전시1](https://github.com/Sminho/IoT_Project/assets/13104540/14b2d936-6489-417a-86e5-4c251bcd7534)

시연 영상(썸네일 클릭시 유튜브로 이동)
-
[![Video Label](http://img.youtube.com/vi/4uXna_kEQ04/0.jpg)](https://youtu.be/4uXna_kEQ04)


제 2회 AI•ICT 창의자율과제(2022.3~2022.12)공모전 은상 수상
-
<img src="https://user-images.githubusercontent.com/13104540/230714186-d7019008-b375-43e1-b6c6-bfa2cfab9bf3.jpg"  width="210" height="300"><img src="https://github.com/Sminho/IoT_Project/assets/13104540/a6f2b6cc-c3dd-4c27-99fa-39ce7f58c8fb"  width="210" height="300">

해당 과제물로 참가한 공모전
-
<img src="https://user-images.githubusercontent.com/13104540/230714183-00d0afe2-fd79-4fc8-83a3-0a17ab1adcd9.png"  width="210" height="300"><img src="https://user-images.githubusercontent.com/13104540/230714184-3d05e29e-e5d8-43a0-80b9-326d9c3f82cd.png"  width="210" height="300">

ICT 챌린지 2022 (2022.8~2022.9)

ITRC 인재양성대전 2023 (2023.4.19~2023.4.21)

-이미지는 클릭시 확대됩니다-

구성요소
-
1. Switch - 버튼을 누르거나 회전하는 역할을 대신하는 장치
![슬라이드10](https://github.com/Sminho/IoT_Project/assets/13104540/e882907a-25ff-449f-9ef0-256fea337458)
이미지에 언급된 모터들과 3D 모델링으로 구현

3. Controller - 위의 Switch 장치들을 연결하는 역할
![슬라이드13](https://github.com/Sminho/IoT_Project/assets/13104540/098f3dcd-7898-4330-9e2f-aabca91077dc)
![스크린샷 2023-09-21 224257](https://github.com/Sminho/IoT_Project/assets/13104540/89149303-8b2d-4334-879f-4a1112868ff7)
![스크린샷 2023-09-21 224328](https://github.com/Sminho/IoT_Project/assets/13104540/0353b343-a401-4828-900a-db5688d2a13f)
EasyEDA를 이용해 설계하고 만든 PCB (https://oshwlab.com/smh9800/pcb-practice1_copy_copy_copy 참고)


5. Hub - 컨트롤러를 WiFi를 통해서 외부망(Firebase)에 연결
![슬라이드14](https://github.com/Sminho/IoT_Project/assets/13104540/72b45e03-65cb-4917-8333-28a25a0074e3)
![슬라이드15](https://github.com/Sminho/IoT_Project/assets/13104540/07ed7d13-cd99-4a87-9aca-e3779fec633a)
아두이노(터치LCD쉴드) <-> ESP32(BLE, WiFi)간 시리얼 통신으로 연결하여 사용

7. Web Application - 스마트폰/PC 등을 이용한 제어가 가능하게 함
![슬라이드19](https://github.com/Sminho/IoT_Project/assets/13104540/da9c1117-efd1-4a62-a373-840c6c494125)
Firebase를 이용한 어플리케이션
그대로 구현 시 배포를 위한 Node module, Fontawesome 등 라이브러리 추가 후 프로젝트 내용 덮어씌우는 걸 추천합니다.

