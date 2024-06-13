import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AirQ } from '../../AirQ';
import { HomePage } from '../home/home';
import { Chart } from 'chart.js'
import { DataFetchProvider } from '../../providers/data-fetch/data-fetch';
import { HttpClient } from '@angular/common/http';



/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {

  @ViewChild('barCanvas') barCanvas;

  area: AirQ;
  barChart: any;
  gas_ppm: any = null;
  apiUrl = 'http://127.0.0.1:3000'
  

  constructor(public navCtrl: NavController, public navParams: NavParams,public dataService: DataFetchProvider,public http: HttpClient) {
    this.area = navParams.get('selectedAreaInfo');
 
  }
  
  ionViewWillEnter() : void{
    this.http.get(this.apiUrl + '/get-data?location=' + this.area.place).subscribe(data => {
    this.gas_ppm = data;
    console.log(data)
    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'bar',
      data: {
          labels: ["CO2", "CO", "CH4", "AQI"],
          datasets: [{
              label: 'In PPM',
              data: [Number(this.gas_ppm.co2),Number(this.gas_ppm.co),Number(this.gas_ppm.ch4),Number(this.gas_ppm.aqi_val)],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }

  });
  },
  err => {
      console.log(err);
  });
 }

  
  returnHome() {
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.popToRoot();
  }

  ionViewDidLoad() {

   
  }

}
