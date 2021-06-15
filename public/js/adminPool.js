window.onload = function(){
    setupSideBar();
    setupCalendar();
}

let setupSideBar = ()=>{
    let allEl = document.getElementsByClassName('nav-link');
    //console.log(allEl);
    for(let i=0;i<allEl.length;i++){
        allEl[i].classList.remove('active');
    }
    document.getElementById('pool').classList.add('active');
}
let toopTipTemplate = Handlebars.compile(`
    
        <p style='display: inline;'>{{description}}</p>
        <button type="button" class="btn btn-danger btn-sm delete-booking-btn" data-booking-id="{{booking_id}}" ><i class="fas fa-calendar-times fa-sm" style='display:inline'></i></button>
    
`)
let setupCalendar = async ()=>{
    let result = await getEvent();
    console.log(result);
    let resource = result[0].data;
    let course = result[1].data;
    let rowEvents = result[2].data;
    let events = formatEvent(rowEvents,course);
    console.log('formatted events',events);
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
            eventDidMount:function(info){
                
               let newDiv = document.createElement('div');
               newDiv.innerHTML = toopTipTemplate({description:info.event.extendedProps.description,booking_id:info.event.extendedProps.booking_id})
               setupDeleteBtn(newDiv);
               
               let tooltip =  tippy(info.el,{
                   allowHTML:true,
                    theme:'light',
                   interactive:true,
                   content:newDiv,
                   placement:'left'

               })
            },
            // slotLabelInterval:{hours:3},
            // slotDuration:'03:00:00',
            slotMinTime:'09:00:00',
            slotMaxTime:'19:00:00',
            expandRows:'true',
            resourceAreaWidth:'15%',
            resourceAreaColumns:[
                {
                    field:'name',
                    headerContent: 'Pool Name'
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

let setupDeleteBtn = (outerDiv)=>{
    //console.log('setting up delete btn',outerDiv);
    let deleteBtn = outerDiv.querySelector('.delete-booking-btn');
    //console.log(deleteBtn);
    deleteBtn.addEventListener('click',(e)=>{
        //console.log('this is the button',e.currentTarget);
        let orderId = e.currentTarget.getAttribute('data-booking-id')
        console.log('this is my order id',orderId);
        axios.delete('/admin/api/pool/schedule',{
            data:{
                bookingId:orderId
            }
        }).then((data)=>{
            console.log(data);
            if(data.data=='done'){
                window.location.reload();
            }
        })
    })
}
let getEvent =  ()=>{
    let getPool = axios.get('/admin/api/pool');
    let getEvent = axios.get('/admin/api/pool/schedule/events');
    let getCourse = axios.get('/admin/api/course');
    return Promise.all([getPool,getCourse,getEvent]);
}
let formatEvent = (raw,course)=>{
    let result = [];
    for(let i=0;i<raw.length;i++){
        let start = new Date(raw[i].booking_date).toISOString().slice(0,10)+sessions[raw[i].booking_session-1].start;
        let end = new Date(raw[i].booking_date).toISOString().slice(0,10)+sessions[raw[i].booking_session-1].end;
        //console.log('start',new Date(start));
        //console.log('end',end);
        let courseName;
        let category;
        course.map((item)=>{
            if(raw[i].course_id==item.id){
                courseName = item.course_name;
                category = categories[item.category];
            }
        })
        let courseStartDate = new Date(raw[i].start_date).toISOString().slice(0,10);
        let description = `${courseStartDate} ${raw[i].instructor_name}`;
        result.push({
            resourceId:raw[i].pool_id,
            title:courseName,
            backgroundColor:category,
            start:new Date(start),
            end:new Date(end),
            url:`/admin/course/schedule/${raw[i].class_course_id}`,
            description:description,
            booking_id:raw[i].booking_id
        })
    }

    return result;
}

let exampleResources = [
    {
        id: 1,
        name: 'Pok Fu Lam Standford Pool',
        
    },
    {
      id: 2,
      name: 'Morse Park Swimming Pool',
      
    }
];
let exampleEvents = [
    {
        resourceId:1,
        title:'PADI Discover Snorkeling',
        start:'2021-06-11T09:00:00',
        end:'2021-06-11T12:00:00',
        description:'2021-06-10 Dave Chueng',
        url:'/admin/course/schedule/1',
        color:'#28a745',
        booking_id:1
    }
];
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