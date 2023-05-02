import React, {useEffect, useState} from 'react'
import "../appointments/Appointment.scss"
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCalendar} from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios'
import {useNavigate} from 'react-router-dom'

function Appointment() {

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [stringDate, setStringDate] = useState("");
    const [week, setWeek] = useState([{}]);
    const [list, setList] = useState([]);
    const dayName = ["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"];
    const hours = [
      {
        hour: "08:00"
      },
      {
        hour: "08:30"
      },
      {
        hour: "09:00"
      },
      {
        hour: "09:30"
      },
      {
         hour: "10:00"
      },
      {
        hour: "10:30"
      },
      {
        hour: "11:00"
      },
      {
        hour: "11:30"
      },
      {
        hour: "12:00"
      },
      {
        hour: "12:30"
      },
      {
        hour: "13:00"
      },
      {
        hour: "13:30"
      },
      {
        hour: "14:00"
      },
      {
        hour: "14:30"
      },
      {
        hour: "15:00"
      },
      {
        hour: "15:30"
      },
      {
        hour: "16:00"
      },
      {
        hour: "16:30"
      },
      {
        hour: "17:00"
      },
      {
        hour: "17:30"
      },
      {
        hour: "18:00"
      },
      {
        hour: "18:30"
      },
      {
        hour: "19:00"
      },
      {
        hour: "19:30"
      },
      {
        hour: "20:00"
      },
      {
        hour: "20:30"
      },
      {
        hour: "21:00"
      },
      {
        hour: "21:30"
      },
      {
        hour: "22:00"
      },
      {
        hour: "22:30"
      }
    ];

    useEffect(() => {
        getDate(date.getMonth() + 1, date.getDate(), date.getFullYear(), date.getDay());
        getSchedule();
    }, [date]);

    function onDateChange(date) {
        setDate(date);
        setOpen(false);
    }

    function getSchedule() {
        Axios.post('http://localhost:3001/get-schedule', {
            id_doctor: sessionStorage.getItem("UID"),
            arr: arr
        }).then((response) => {
              if(response.data.resultAppointment)
              {
                  schedule(response.data.resultAppointment, response.data.resultPatient);
              }
              else
              {
                  schedule(0, 0);
              }
        })
    }

    var arr = [];
    var matrix = [[]];

    function schedule(x, y) {

      hours.forEach(function(h){
          matrix.push([h.hour, "", "", "", "", "", "", ""]);
      });

      if(x.length && y.length)
      {
          hours.forEach(function(hour, index){
              x.forEach(function(x_element){
                  if(hour.hour == x_element.hour)
                  {
                      var day_n = parseInt((x_element.date).substring(8, 10));
                      var i = arr.findIndex(object => {
                          return object.day === day_n;
                      })

                      y.forEach(function(y_element){
                          if(y_element.id_patient == x_element.id_patient)
                          {
                              matrix[index + 1][i + 1] = y_element.lastname + " " + y_element.firstname + "\r\nID pacient: " + x_element.id_patient;
                          }
                      })
                  }
              })
          })
      }

      var aux = [{}];

      for(var j = 1; j < matrix.length; j++)
      {
          var sub = matrix[j],
          item = {
              hour: sub[0],
              day1: sub[1],
              day2: sub[2],
              day3: sub[3],
              day4: sub[4],
              day5: sub[5],
              day6: sub[6],
              day7: sub[7],
          }
          aux.push(item);
      }
      setList(aux);
  }

    function verifyLeapYear(year) {
        return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
    }

    function getMonthDays(month, year) {
        switch(month)
        {
            case 1: return 31;
            case 2: return verifyLeapYear(year)? 29 : 28;
            case 3: return 31;
            case 4: return 30;
            case 5: return 31;
            case 6: return 30;
            case 7: return 31;
            case 8: return 31;
            case 9: return 30;
            case 10: return 31;
            case 11: return 30;
            case 12: return 31;
        }
    }

    function getMonthName(month) {
        switch(month)
        {
            case 1: return "Ianuarie";
            case 2: return "Februarie";
            case 3: return "Martie";
            case 4: return "Aprilie";
            case 5: return "Mai";
            case 6: return "Iunie";
            case 7: return "Iulie";
            case 8: return "August";
            case 9: return "Septembrie";
            case 10: return "Octombrie";
            case 11: return "Noiembrie";
            case 12: return "Decembrie";
        }
    }

    function getDate(month, day, year, day_number) {

        if(day_number == 0)
        {
            day_number += 7;
        }

        var minDate = 0, monthDays, i, count;

        minDate = day - day_number;

        if(month != 1)
        {
            if(minDate < 0)
            {
                monthDays = getMonthDays(month - 1, year);
                minDate = monthDays + day - day_number + 1;
                
                i = 0;
                count = 1;

                while(i < 7)
                {
                    if(minDate <= monthDays)
                    {
                        arr.push({day: minDate, month: month-1, year: year});
                        minDate += 1;
                    }
                    else
                    {
                        arr.push({day: count, month: month, year: year});
                        count += 1;
                    }
                    i += 1;
                }
            }
            else if(minDate < 22)
            {
                minDate = day - day_number + 1;
                i = 0;
                while(i < 7)
                {
                    arr.push({day: minDate, month: month, year: year});
                    minDate += 1;
                    i += 1;
                }
            }
            else if(minDate >= 22)
            {
                minDate = day - day_number + 1;
                if(month != 12)
                {
                    monthDays = getMonthDays(month, year);

                    i = 0;
                    count = 0;

                    while(i < 7)
                    {
                        if(minDate <= monthDays)
                        {
                            arr.push({day: minDate, month: month, year: year});
                            minDate += 1;
                        }
                        else
                        {
                            count += 1;
                            arr.push({day: count, month: month + 1, year: year});
                        }
                        i += 1;
                    }
                }
                else
                {
                    monthDays = getMonthDays(month, year);

                    i = 0;
                    count = 1;

                    while(i < 7)
                    {
                        if(minDate <= monthDays)
                        {
                            arr.push({day: minDate, month: 12, year: year});
                            minDate += 1;
                        }
                        else
                        {
                            arr.push({day: count, month: 1, year: year + 1});
                            count += 1;
                        }
                        i += 1;
                    }
                }
            }
        }
        else
        {
            if(minDate < 0)
            {
                if(month == 1)
                {
                    monthDays = getMonthDays(12, year);
                    minDate = monthDays + day - day_number + 1;

                    i = 0;
                    count = 1;

                    while(i < 7)
                    {
                        if(minDate <= monthDays)
                        {
                            arr.push({day: minDate, month: 12, year: year - 1});
                            minDate += 1;
                        }
                        else
                        {
                            arr.push({day: count, month: 1, year: year});
                            count += 1;
                        }
                        i += 1;
                    }
                }
            }
        }

        if(arr[0].month != arr[6].month)
        {
            if(arr[0].year != arr[6].year)
            {
                setStringDate(arr[0].day + " " + getMonthName(arr[0].month) + ", " + arr[0].year +
                " - "  + arr[6].day + " " + getMonthName(arr[6].month) + ", " + arr[6].year);
            }
            else
            {
                setStringDate(arr[0].day + " " + getMonthName(arr[0].month) +" - "  + arr[6].day + 
                " " + getMonthName(arr[6].month) + ", " + arr[0].year);
            }
        }
        else
        {
            setStringDate(arr[0].day + " - " + arr[6].day + " " + getMonthName(arr[0].month) + ", " + arr[0].year);
        }

        var week_arr = arr.map((val, index) => {
            return{
                day: val.day,
                name: dayName[index]
            }
        }) 

        setWeek(week_arr);

    }

    function getID(id) {
        var matches = id.match(/(\d+)/);
        sessionStorage.setItem("id", matches[0]);
        navigate('/profile/patients/medical-record');
    }

  return (
    <div className="doctor">
    <div className="container-doctor">
        <div className="header">
            <div className="data">
                    <FontAwesomeIcon icon={faCalendar} onClick={()=>{setOpen(true)}} className="icon"/>
                    <div className="week">{stringDate}</div>
            </div>
            {open && <div className="calendar-open"><Calendar onChange={onDateChange} date={date}/></div>}
        </div>
        <div className="table">
          <table>
                <thead>
                    <tr>
                        <th></th>
                        {
                            week.map((value, index) => {
                                return(
                                    <th>{value.name} <br></br> {value.day}</th>
                                )
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                      list.map((value, index) => {
                            if(index > 0)
                            {
                                return(
                                    <tr>
                                        <td>{value.hour}</td>
                                        <td className={value.day1 != ""? "day1" : "free"} onClick={() => {
                                            if(value.day1 != "")
                                            {
                                              getID(value.day1);
                                            }
                                        }}>{value.day1}</td>
                                        <td className={value.day2 != ""? "day2" : "free"} onClick={() => {
                                            if(value.day2 != "")
                                            {
                                              getID(value.day2);
                                            }
                                        }}>{value.day2}</td>
                                        <td className={value.day3 != ""? "day3" : "free"} onClick={() => {
                                            if(value.day3 != "")
                                            {
                                              getID(value.day3);
                                            }
                                        }}>{value.day3}</td>
                                        <td className={value.day4 != ""? "day4" : "free"} onClick={() => {
                                            if(value.day4 != "")
                                            {
                                              getID(value.day4);
                                            }
                                        }}>{value.day4}</td>
                                        <td className={value.day5 != ""? "day5" : "free"} onClick={() => {
                                            if(value.day5 != "")
                                            {
                                              getID(value.day5);
                                            }
                                        }}>{value.day5}</td>
                                        <td className={value.day6 != ""? "day6" : "free"} onClick={() => {
                                            if(value.day6 != "")
                                            {
                                              getID(value.day6);
                                            }
                                        }}>{value.day6}</td>
                                        <td className={value.day7 != ""? "day7" : "free"} onClick={() => {
                                            if(value.day7 != "")
                                            {
                                              getID(value.day7);
                                            }
                                        }}>{value.day7}</td>
                                    </tr>
                                ) 
                            }
                        })
                    }
                </tbody>
            </table>
        </div>
      </div>
      </div>
    )
}

export default Appointment