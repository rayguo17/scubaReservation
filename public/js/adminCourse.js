const categories ={
    junior:'#17a2b8',
    diver: '#28a745',
    specialty:'#ffc107'
}

window.onload = function(){
    setupSideBar();
    getEvent();
    loadCourse();
}

let setupCalendar = function(event){
    
    var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            
            height: 850,
            headerToolbar: {
                start: 'prev,next today',
                center: 'title',
                end: 'dayGridMonth,timeGridWeek,listMonth'
            },
            initialView: 'dayGridMonth',
            initialDate: new Date(Date.now()),
            navLinks: true, // can click day/week names to navigate views
            dayMaxEventRows:4, 
            events: event
        });

        calendar.render();
        //hide the license message
        document.getElementsByClassName('fc-license-message')[0].style.display = 'none';
} 
let getEvent = function(){
    axios.get('/admin/api/course/schedule').then((data)=>{
        console.log('getEvent',data.data);
        let event = [];
        for (let i=0;i<data.data.length;i++){
            let date = new Date(data.data[i].start_date);
            date.setDate(date.getDate()+1);
            date = date.toISOString();
            //console.log(date.slice(0,10));
            let category = categories[data.data[i].course.category];
            event.push({title:data.data[i].course.course_name,start:date.slice(0,10),url:`/admin/course/schedule/${data.data[i].id}`,backgroundColor:category,borderColor:category})
        }
        console.log(event);
        setupCalendar(event);
    })
}  

let exampleEvent = [
    {
        title: 'All Day Event',
        start: '2020-02-01',
    },
    {
        title: 'Long Event',
        start: '2020-02-07',
        end: '2020-02-10'
    },
    {
        groupId: 999,
        title: 'Repeating Event',
        start: '2020-02-09T16:00:00'
    },
    {
        groupId: 999,
        title: 'Repeating Event',
        start: '2020-02-16T16:00:00'
    },
    {
        title: 'Conference',
        start: '2020-02-11',
        end: '2020-02-13'
    },
    {
        title: 'Meeting',
        start: '2020-02-12T10:30:00',
        end: '2020-02-12T12:30:00'
    },
    {
        title: 'Lunch',
        start: '2020-02-12T12:00:00'
    },
    {
        title: 'Meeting',
        start: '2020-02-12T14:30:00'
    },
    {
        title:'Test',
        start: '2020-02-12T14:30:00'
    },
    {
        title:'Test2',
        start: '2020-02-12T14:30:00'
    },
    {
        title: 'Happy Hour',
        start: '2020-02-12T17:30:00'
    },
    {
        title: 'Dinner',
        start: '2020-02-12T20:00:00'
    },
    {
        title: 'Birthday Party',
        start: '2020-02-13T07:00:00'
    },
    {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: '2020-02-28'
    }
];

let setupSideBar = ()=>{
    let allEl = document.getElementsByClassName('nav-link');
    //console.log(allEl);
    for(let i=0;i<allEl.length;i++){
        allEl[i].classList.remove('active');
    }
    document.getElementById('Course').classList.add('active');
    document.getElementById('course-schedule').classList.add('active');
}
let loadCourse = ()=>{
    axios.get('/admin/api/course').then((data)=>{
        console.log(data.data);
        let coursePicker = document.getElementById('course-picker');

        for(let i=0;i<data.data.length;i++){
            let newOption = document.createElement('option');
            newOption.value = data.data[i].id;
            newOption.text = data.data[i].course_name;
            coursePicker.appendChild(newOption);
        }
        
    })
}


