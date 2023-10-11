import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { map, catchError, filter, share } from 'rxjs/operators'
import { BehaviorSubject, Subject } from 'rxjs';
import * as moment from 'moment';

declare global {
  interface Window {
    RTCPeerConnection: RTCPeerConnection;
    mozRTCPeerConnection: RTCPeerConnection;
    webkitRTCPeerConnection: RTCPeerConnection;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  localIp = sessionStorage.getItem('LOCAL_IP');
  app = ''

  public isLoading:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public newLogin:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public lastUrl: any

  private ipRegex = new RegExp(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);

  apiRestful:string = `api/rf/index.php/`;

  tokenCheck = new Subject()
 
  constructor(
                private http:HttpClient,
                private zone: NgZone,
                private domSanitizer:DomSanitizer
              ) {
      this.determineLocalIp()
  }

  transform( url: string): any {
    return this.domSanitizer.bypassSecurityTrustUrl( url );
  }

  extTokenLink( url, params={}, loginReq = true ){

    if( loginReq ){
      let currentUser = JSON.parse(localStorage.getItem( this.app + 'currentUser'));
      url += `?token=${currentUser ? currentUser.token : 'noToken'}&gid=${currentUser ? currentUser.hcInfo.idGrupo : '-1'}`
      url += `&usn=${currentUser ? currentUser.username : 'noUser'}&usid=${currentUser ? currentUser.hcInfo.id : 'noId'}`
      url += `&zdId=${currentUser ? currentUser.hcInfo.zdId : 'noId'}&localIp=${this.localIp}`

    }

    for( let p in params ){
      if( params.hasOwnProperty(p) ){
        url += `&${p}=${params[p]}`
      }
    }

    let urlOK = this.transform( url )

    let headers = new HttpHeaders({
      'Content-Type':'application/json'
    });

    return urlOK.changingThisBreaksApplicationSecurity
  }

  restfulUpload( params, apiRoute, loginReq = true ){

    let url

    if( loginReq ){
      let currentUser = JSON.parse(localStorage.getItem( this.app + 'currentUser'));
      url = `${ this.apiRestful }${ apiRoute }?token=${currentUser ? currentUser.token : 'noToken'}&gid=${currentUser ? currentUser.hcInfo.idGrupo : '-1'}&usn=${currentUser ? currentUser.username : 'noUser'}&usid=${currentUser ? currentUser.hcInfo.id : 'noId'}&zdId=${currentUser ? currentUser.hcInfo.zdId : 'noId'}&localIp=${this.localIp}&usid=${currentUser ? currentUser.hcInfo.id : 'noId'}&zdId=${currentUser ? currentUser.hcInfo.zdId : 'noId'}&localIp=${this.localIp}`
    }else{
      url = `${ this.apiRestful }${ apiRoute }`
    }

    let urlOK = this.transform( url )

    let body = JSON.stringify( params );
    let headers = new HttpHeaders({
      'Content-Type':'application/json'
    });

    // return this.http.put( urlOK.changingThisBreaksApplicationSecurity, body, { headers } )
    return this.http.put( url, body, { headers, reportProgress: true, observe: 'events' } )
        .pipe()
        
  }

  restfulPut( params, apiRoute, loginReq = true ){

    let url

    if( loginReq ){
      let currentUser = JSON.parse(localStorage.getItem( this.app + 'currentUser'));
      url = `${ this.apiRestful }${ apiRoute }?token=${currentUser ? currentUser.token : 'noToken'}&gid=${currentUser ? currentUser.hcInfo.idGrupo : '-1'}&usn=${currentUser ? currentUser.username : 'noUser'}&usid=${currentUser ? currentUser.hcInfo.id : 'noId'}&zdId=${currentUser ? currentUser.hcInfo.zdId : 'noId'}&localIp=${this.localIp}&usid=${currentUser ? currentUser.hcInfo.id : 'noId'}&zdId=${currentUser ? currentUser.hcInfo.zdId : 'noId'}&localIp=${this.localIp}`
    }else{
      url = `${ this.apiRestful }${ apiRoute }`
    }

    let urlOK = this.transform( url )

    let body = JSON.stringify( params );
    let headers = new HttpHeaders({
      'Content-Type':'application/json'
    });

    // return this.http.put( urlOK.changingThisBreaksApplicationSecurity, body, { headers } )
    return this.http.put( url, body, { headers } )
        .pipe(
           share(),
           map( res => res ),
           filter( res => {
             if( res['msg'] && res['msg']  == 'Token Expired' ){
               
               this.tokenCheck.next( false )
               return false
             }else{
               return true
             }
           })
        )
  }

  restfulPost( params, apiRoute, alterRoute = false, token? ){

    let currentUser = JSON.parse(localStorage.getItem( this.app + 'currentUser'));

    let url = ''
    let headers:any

    if( !alterRoute ){
      url = `${ this.apiRestful }${ apiRoute }?token=${currentUser ? currentUser.token : 'noToken'}&gid=${currentUser ? currentUser.hcInfo.idGrupo : '-1'}&usn=${currentUser ? currentUser.username : 'noUser'}&usid=${currentUser ? currentUser.hcInfo.id : 'noId'}&zdId=${currentUser ? currentUser.hcInfo.zdId : 'noId'}&localIp=${this.localIp}`
      headers = new HttpHeaders({
        'Content-Type':'application/json'
      });
    }else{
      url = apiRoute
      headers = new HttpHeaders({
        'Content-Type':'application/json',
        Authorization : token
      });
    }

    let urlOK = this.transform( url )

    let body = JSON.stringify( params );


    return this.http.post( urlOK.changingThisBreaksApplicationSecurity, body, { headers } )
        .pipe(
           map( res => res ),
           filter( res => {
            if( res['msg'] && res['msg'] == 'Token Expired' ){
              
              this.tokenCheck.next( false )
              return false
            }else{
              return true
            }
          })
        )
  }

  helpPost( params, apiRoute ){

    let currentUser = JSON.parse(localStorage.getItem( this.app + 'currentUser'));
    let url = 'http://help.pricetravel.com.mx/rest/api/2/issue/'

    let urlOK = this.transform( url )

    let body = JSON.stringify( params );

    let headers = new HttpHeaders({
        'Content-Type':'application/json',
        'Authorization':'Basic YWxiZXJ0LnNhbmNoZXo6QER5ajIxMjc4Mzcw'
      });


    return this.http.post( urlOK.changingThisBreaksApplicationSecurity, body, { headers } )
        .pipe(
           map( res => res )
        )
  }

  restfulImgPost( params, apiRoute ){

    let currentUser = JSON.parse(localStorage.getItem( this.app + 'currentUser'));
    let url = `${ this.apiRestful }${ apiRoute }?token=${currentUser ? currentUser.token : 'noToken'}&gid=${currentUser ? currentUser.hcInfo.idGrupo : '-1'}&usn=${currentUser ? currentUser.username : 'noUser'}&usid=${currentUser ? currentUser.hcInfo.id : 'noId'}&zdId=${currentUser ? currentUser.hcInfo.zdId : 'noId'}&localIp=${this.localIp}`

    let urlOK = this.transform( url )

    return this.http.post( urlOK.changingThisBreaksApplicationSecurity, params )
        .pipe(
           map( res => res )
        )
  }

  restfulDelete( id, apiRoute ){

    let currentUser = JSON.parse(localStorage.getItem( this.app + 'currentUser'));
    let url = `${ this.apiRestful }${ apiRoute }/${ id }?token=${currentUser ? currentUser.token : 'noToken'}&gid=${currentUser ? currentUser.hcInfo.idGrupo : '-1'}&usn=${currentUser ? currentUser.username : 'noUser'}&usid=${currentUser ? currentUser.hcInfo.id : 'noId'}&zdId=${currentUser ? currentUser.hcInfo.zdId : 'noId'}&localIp=${this.localIp}`

    let urlOK = this.transform( url )

    let headers = new HttpHeaders({
      'Content-Type':'application/json'
    });

    return this.http.delete( urlOK.changingThisBreaksApplicationSecurity, { headers } )
        .pipe(
           map( res => res )
        )
  }


  restfulGet( id, apiRoute ){

    let currentUser = JSON.parse(localStorage.getItem( this.app + 'currentUser'));
    let url = `${ this.apiRestful }${ apiRoute }/${ id }?token=${currentUser ? currentUser.token : 'noToken'}&gid=${currentUser ? currentUser.hcInfo.idGrupo : '-1'}&usn=${currentUser ? currentUser.username : 'noUser'}&usid=${currentUser ? currentUser.hcInfo.id : 'noId'}&zdId=${currentUser ? currentUser.hcInfo.zdId : 'noId'}&localIp=${this.localIp}`

    let urlOK = this.transform( url )

    let headers = new HttpHeaders({
      'Content-Type':'application/json'
    });

    return this.http.get( urlOK.changingThisBreaksApplicationSecurity, { headers } )
        .pipe(
           map( res => res ),
           filter( res => {
            if( res['msg'] && res['msg']  == 'Token Expired' ){
              
              this.tokenCheck.next( false )
              return false
            }else{
              return true
            }
          })
        )
  }
  
  xmlGet( id, apiRoute ){

    let currentUser = JSON.parse(localStorage.getItem( this.app + 'currentUser'));
    let url = `${ this.apiRestful }${ apiRoute }/${ id }?token=${currentUser ? currentUser.token : 'noToken'}&gid=${currentUser ? currentUser.hcInfo.idGrupo : '-1'}&usn=${currentUser ? currentUser.username : 'noUser'}&usid=${currentUser ? currentUser.hcInfo.id : 'noId'}&zdId=${currentUser ? currentUser.hcInfo.zdId : 'noId'}&localIp=${this.localIp}&timestamp=${ moment().format('x')}`

    let urlOK = this.transform( url )

    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.get( urlOK.changingThisBreaksApplicationSecurity, { headers, responseType: 'text' } )
        .pipe(
           map( res => res ),
           filter( res => {
            if( res['msg'] && res['msg']  == 'Token Expired' ){
              
              this.tokenCheck.next( false )
              return false
            }else{
              return true
            }
          })
        )
  }

  getFile( id, apiRoute, test = false ){

    let url = test ? `/${ apiRoute }/${ id }` : `${ apiRoute }/${ id }`

    let urlOK = this.transform( url )

    let headers = new HttpHeaders({
      'Content-Type':'application/json'
    });

    return this.http.get( urlOK.changingThisBreaksApplicationSecurity, { responseType: 'arraybuffer'  } )
        .pipe(
           map( res => res )
        )
  }

  testGet(  ){

    let currentUser = JSON.parse(localStorage.getItem( this.app + 'currentUser'));
    let url = `api/rf/test.php`

    let urlOK = this.transform( url )

    let headers = new HttpHeaders({
      'Content-Type':'application/json'
    });

    return this.http.get( urlOK.changingThisBreaksApplicationSecurity, { headers } )
        .pipe(
           map( res => res )
        )
  }



  testApi( variable ){
    // console.log( variable )
  }

  private determineLocalIp() {
    // window.RTCPeerConnection = this.getRTCPeerConnection();

    // const pc = new RTCPeerConnection({ iceServers: [] });
    // pc.createDataChannel('');
    // pc.createOffer().then(pc.setLocalDescription.bind(pc));

    // pc.onicecandidate = (ice) => {
    //   this.zone.run(() => {
    //     if (!ice || !ice.candidate || !ice.candidate.candidate) {
    //       return;
    //     }

    //     this.localIp = this.ipRegex.exec(ice.candidate.candidate)[1];
    //     console.log(this.localIp)
    //     sessionStorage.setItem('LOCAL_IP', this.localIp);

    //     pc.onicecandidate = () => {};
    //     pc.close();
    //   });
    // };
  }

  private getRTCPeerConnection() {
    return window.RTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection;
  }


}
