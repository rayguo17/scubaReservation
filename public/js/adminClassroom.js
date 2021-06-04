window.onload = function(){
    // console.log(getEvent())
    setupSideBar();
    setupCalendar();
}

let setupCalendar = async function(){
    let result = await getEvent();
    console.log(result);
    let resource = result[0].data;
    let rowEvents = result[1].data;
    let course = result[2].data;
    let events = formatEvent(rowEvents,course);
    console.log('format data',events);
    var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            views:{
                resourceTimelineFourDays:{
                    type:'resourceTimeline',
                    duration:{days:4}
                }
            },
            height: 850,
            headerToolbar: {
                start: 'prev,next today',
                center: 'title',
                end: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth'
            },
            // slotLabelInterval:{hours:3},
            // slotDuration:'03:00:00',
            slotMinTime:'09:00:00',
            slotMaxTime:'19:00:00',
            expandRows:'true',
            resourceAreaWidth:'13%',
            resourceAreaColumns:[
                {
                    field:'name',
                    headerContent: 'Classroom Name'
                },
                
            ],
            resources: resource,
            initialView: 'resourceTimelineFourDays',
            initialDate: new Date(Date.now()),
            navLinks: true, // can click day/week names to navigate views
            dayMaxEventRows:4, 
            events: events
        });

        calendar.render();
        //hide the license message
        document.getElementsByClassName('fc-license-message')[0].style.display = 'none';
        
}
const sessions = [
    {
        start:'T09:00:00',
        end:'T12:00:00'
    },
    {
        start:'T13:00:00',
        end:'T16:00:00'
    },
    {
        start:'T16:00:00',
        end:'T19:00:00'
    }
];
const categories ={
    junior:'#17a2b8',
    diver: '#28a745',
    specialty:'#ffc107'
}
let getEvent =  ()=>{
    let getEvent = axios.get('/admin/api/classroom');
    let getClassroom = axios.get('/admin/api/classroom/schedule');
    let getCourse = axios.get('/admin/api/course');
    return Promise.all([getEvent,getClassroom,getCourse]);
}
let formatEvent = (raw,course)=>{
    let result = [];
    for(let i=0;i<raw.length;i++){
        let start = new Date(raw[i].booking_date).toISOString().slice(0,10)+sessions[raw[i].booking_session-1].start;
        let end = new Date(raw[i].booking_date).toISOString().slice(0,10)+sessions[raw[i].booking_session-1].end;
        console.log('start',new Date(start));
        console.log('end',end);
        let courseName;
        let category;
        course.map((item)=>{
            if(raw[i].course_id==item.id){
                courseName = item.course_name;
                category = categories[item.category];
            }
        })
        result.push({
            resourceId:1,
            title:courseName,
            backgroundColor:category,
            start:new Date(start),
            end:new Date(end)
        })
    }

    return result;
}

let exampleResources = [
    {
        id: 1,
        name: 'hanseng',
        
    },
    {
      id: 2,
      name: 'Cocoon',
      
    }
];
let exampleEvents = [
    {
        resourceId:1,
        title:'course1',
        start:'2021-06-12'
    }
];

let setupSideBar = ()=>{
    let allEl = document.getElementsByClassName('nav-link');
    //console.log(allEl);
    for(let i=0;i<allEl.length;i++){
        allEl[i].classList.remove('active');
    }
    document.getElementById('classroom').classList.add('active');
}