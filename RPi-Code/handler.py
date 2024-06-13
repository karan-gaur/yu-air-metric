import serial 
import threading
import requests
import time
import random
import os
class DeviceHandler:
    
    def __init__(self,device_id,location,baud_rate = 9600,serial_port = '/dev/ttyUSB0',server_address = 'http://127.0.0.1:3000/post-data'):
        self.baud_rate = baud_rate
        self.serial_port = serial_port
        self.server_address = server_address 
        self.DeviceID = device_id
        self.Location = location

        try:
            self.uc = serial.Serial(self.serial_port,self.baud_rate)

        except:
            print("\nPermission issues detected while accessing the port.\n\tTry running - 'sudo chmod a+rw /dev/ttyUSB0'\n")
            exit()

    def run(self):
        try:
            FetchedData = self.uc.readline()
            FetchedData = FetchedData.decode("utf-8") 

            var1,var2,var3,var4 = FetchedData.split('-')
        except:
            print('\nHaving issues with decoding...')
            return


        data ={
            'CO2':var1.strip(),
            'CO':var2.strip(),
            'CH4':var3.strip(),
            'AIRQ':var4.strip(),
            'DeviceID': self.DeviceID,
            'location': self.Location
        }
        try:
            r = requests.post(self.server_address,data)
        except:
            os.system('clear')
            print('\n\tServer not responding...Make sure its up and running\n\t\tReconnecting in 10 secs..')
            time.sleep(10)
            return
        print('\n\tValue Sent -> ' + str(data['CO2'])+" "+str(data['CO'])+" "+str(data['CH4']))         



if __name__ == "__main__":
    
    handler = DeviceHandler(device_id = 'JAGAT2019',location = 'Jagatpura')
    
    while True:
        handler.run()
        time.sleep(10)
