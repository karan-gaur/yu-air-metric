#include <MQ135.h>

int sensor_135 = A0;
int sensor_2 = A1;

float sensorVolt;
float sensorDat;

float rZero;
float co2_ppm;
float co_ppm;
float ch4_ppm;
float aqi;

MQ135 gasSensor_AQI = MQ135(sensor_135);

void setup() {
  Serial.begin(9600);
}

void loop() {
  sensorDat = analogRead(sensor_2);
  sensorVolt = sensorDat * 3.3 / 4095;
  
  rZero = gasSensor_AQI.getRZero(); //For Calibration purpose
  
  co_ppm = 10.938*exp(1.7742*sensorVolt);
  co2_ppm = gasSensor_AQI.getPPM();
  ch4_ppm = 3.027*exp(1.0698*sensorVolt);
  aqi = analogRead(sensor_135);
  
  Serial.print(co2_ppm * 100);
  Serial.print("-");
  Serial.print(co_ppm);
  Serial.print("-");
  Serial.print(ch4_ppm);
  Serial.print("-");
  Serial.print(aqi);
  Serial.println("");
  

}
