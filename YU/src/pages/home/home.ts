import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataFetchProvider } from '../../providers/data-fetch/data-fetch';
import { AirQ } from '../../AirQ';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public datafetch: DataFetchProvider) {

  }
  
  items: AirQ[] = this.datafetch.getList(); //I'm using the datafetch service here....which i created earlier.
  
  fetchDetails(area: AirQ){
    
    this.navCtrl.push('DetailsPage',{'selectedAreaInfo': area});
  }

}
