import { Component } from '@angular/core';
import {AlertController, Platform,NavController,MenuController,ModalController,ToastController} from '@ionic/angular';
import {Storage} from "@ionic/storage-angular";
import { register } from 'swiper/element/bundle';
import { Device } from '@capacitor/device';
import { TranslateService } from '@ngx-translate/core';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import {PushinfoComponent} from "./pages/pushinfo/pushinfo.component";
import {UsersService} from "./service/users.service";
register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  //menu lable
  public dir: any;
  public floatD: any;
  //system label
  public checkLanguage: any=0;
  public language: any;
  //login label
  public token:any;
  public userId:any;
  constructor(private usersService: UsersService,private modalController: ModalController,private translate: TranslateService,private platform : Platform,private storage: Storage) {
    this.information();
    this.platform.ready().then(async () => {
      setTimeout(async () => {
        try {
          this.setupNotifications();
        } catch (error) {
         alert("dsf")
        }
      }, 2500);
    });
  }
  async information(){
    document.body.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
    await this.storage.create();
    await this.getDeviceLanguage();
  }
  async setupNotifications (){
    alert("dsfsdfsdfsdsd")
    PushNotifications.requestPermissions().then(permission => {
      if (permission.receive === 'granted') {
        PushNotifications.register();
      }
    });
    //const { token } = await FirebaseMessaging.getToken();
    //لما يكون التطبيق مفتوح
    FirebaseMessaging.addListener('notificationReceived', (notification:any) => {
      const title = notification.notification.title;
      const body = notification.notification.body;
      this.goToPush(title,body);
    });
    // الاشتراك في موضوع معين (اختياري)
    await FirebaseMessaging.subscribeToTopic({ topic: 'samaabdoun' });
    //get tocken
    PushNotifications.addListener('registration', async (tokenData: Token) => {
      alert("NoNoti")
      //token.value
      alert(tokenData);
      this.token = await this.storage.get('token');
      this.userId = await this.storage.get('userId');
      alert(this.token);
      alert(this.userId);
      if(this.token != null && this.token != undefined && this.userId != null && this.userId != undefined){
        let sendValues = {'user_id':this.userId,'udid':tokenData.value};
        this.usersService.userUdid(sendValues).then(async data=>{
        });
      }else{
        alert("error");
      }
    });
    PushNotifications.addListener('registrationError', (error: any) => {
      //add msg for error
      alert("NoNoti")
    });
    PushNotifications.addListener('pushNotificationReceived', async(notification) => {
      //const title = notification.title;
      //const body = notification.body;
    });
    // PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    // });
  }
  async goToPush(title:any,body:any){
    let model = await this.modalController.create({
      component:PushinfoComponent,
      componentProps:{title:title,body:body},
      animated:true,
      cssClass:"modalFilterSortCss"
    });
    model.onDidDismiss().then((data):any=>{
    });
    await model.present();
  }
  async initialiseTranslation(){
    this.translate.get('dir').subscribe((res: string) => {
      this.dir = res;
      document.documentElement.setAttribute('dir', this.dir);
    });
    this.translate.get('floatD').subscribe((res: string) => {
      this.floatD = res;
    });
  }
  async getDeviceLanguage() { 
    await this.storage.get('checkLanguage').then(async checkLanguage=>{
      this.checkLanguage = checkLanguage
    });
    if(this.checkLanguage!=undefined && this.checkLanguage!=null && this.checkLanguage!=""){
      this.translate.setDefaultLang(this.checkLanguage);
      this.language = this.checkLanguage;
      this.translate.use(this.language);
      await this.initialiseTranslation();
    }else{
      const info = await Device.getLanguageCode();
      this.translate.setDefaultLang(info.value); // اللغة الافتراضية
       this.translate.use(info.value);
      this.language = info.value;
      await this.initialiseTranslation();
    }
  }
}
