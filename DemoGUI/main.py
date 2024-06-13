import serial
import tkinter
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.figure import Figure
import time
import threading

plot_graph = False
gas_data = '-'
analog_data = 'NULL'
ppm_data = '-'


baud_rate = 9600
serial_port = '/dev/ttyUSB0'


def state_switch():
    global plot_graph
    if plot_graph == True:
        plot_graph = False

    else:
        plot_graph = True
   

def dataFetch():
    global baud_rate,serial_port,analog_data,ppm_data
    uc = serial.Serial(serial_port,baud_rate)

    while True:
        temp_data = uc.readline()
        temp_data = temp_data.decode("utf-8")
       
        analog_data = temp_data.split('-')[0]
        ppm_data = temp_data.split('-')[1]


       

def thread_handler():
     thread = threading.Thread(target=dataFetch, args=())
     thread.daemon = True
     thread.start()

def labelUpdate():
    global analog_data,plot_graph,ppm_data,plot_data
 
    if plot_graph == True:
        analog_data_label['text'] = 'Analog Value: ' + analog_data
        gas_ppm['text'] = 'Carbon dioxide(CO2): ' + ppm_data +' PPM'
        
    else:
        analog_data_label['text'] = 'Analog Value: NULL'
        gas_ppm['text'] = 'Carbon dioxide(CO2): -'
    
    root.after(1000,labelUpdate)    



root = tkinter.Tk()
root.title('YU - Live Pollution Monitoring')
root.geometry('1050x500')

graph_frame = tkinter.Frame(root,height = 500,width = 600)
graph_frame.pack(side = tkinter.LEFT,padx = 10)
control_frame = tkinter.Frame(root,bg = '#CCCCFF' )
control_frame.pack(side = tkinter.RIGHT,fill='both',expand = True)

fig = Figure()
ax = fig.add_subplot(111)
ax.set_xlabel("Time")
ax.set_ylabel("PPM")

ax.grid()

graph = FigureCanvasTkAgg(fig, master=graph_frame)
graph.get_tk_widget().pack(side="bottom",fill='both',expand=True)

#Labels Here
gas_ppm = tkinter.Label(control_frame,text = 'Carbon dioxide(CO2): '+ gas_data +' PPM',font=("Courier", 14,'bold'))
gas_ppm.pack(pady = (30,5))

analog_data_label = tkinter.Label(control_frame,text = 'Analog Values: ' + analog_data,font=("Courier", 16,'bold'))
analog_data_label.pack(pady = (5,15))

port_in_use = tkinter.Label(control_frame,text = 'Port: ' + serial_port,bg = '#CCCCFF')
port_in_use.pack(anchor = tkinter.SE,side = 'bottom')

start_btn = tkinter.Button(master = control_frame, text = "Start/Stop",bg = '#99FFFF',activebackground = "#66FFFF",command = state_switch)
start_btn.pack()

thread_handler()
labelUpdate()
root.mainloop()