window.onload = () => {
    setupSideBar();
    setupCalendar();
}

let setupSideBar = () => {
    let allEl = document.getElementsByClassName('nav-link');
    //console.log(allEl);
    for (let i = 0; i < allEl.length; i++) {
        allEl[i].classList.remove('active');
    }
    document.getElementById('pool-gear').classList.add('active');
    document.getElementById('Pool').classList.add('active');
}

let setupCalendar = async () => {
    //console.log('calendar browserify', testCalendar.sliceEvents);
    let customListPlugin = calendarPlugin();
    //console.log('plugin',customListPlugin);
    let result  = await getData();
    let resource = result[0].data;
    let course = result[1].data;
    let gearEvents = result[2].data;
    //console.log('result',result);
    console.log('pool',resource);
    console.log('course',course);
    console.log('gearEvent',gearEvents);
    let formattedEvents = eventFormatter(gearEvents,course);
    console.log('formattedEvents',formattedEvents);
    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [customListPlugin],

        height: 850,
        headerToolbar: {
            start: 'prev,next today',
            center: 'title',
            end: 'resourceTimelineWeek,custom'
        },
        slotMinTime: '09:00:00',
        slotMaxTime: '19:00:00',
        expandRows: 'true',
        resourceAreaWidth: '15%',
        resourceAreaColumns: [
            {
                field: 'name',
                headerContent: 'Pool Name'
            },

        ],
        resources: resource,
        initialView: 'resourceTimelineWeek',
        initialDate: new Date(Date.now()),
        events: formattedEvents

    })
    calendar.render();
    //hide the license message
    document.getElementsByClassName('fc-license-message')[0].style.display = 'none';
}
let exampleEvents = [
    {
        resourceId: 1,
        title: 'PADI Discover Snorkeling',
        start: '2021-06-11',
        course_name:'PADI Discover Snorkeling',
        instructor_name: 'Dave Chueng',
        booking_session:1,
        students:[
            {
                id:1,
                name:'ray',
                mask:'yes',
                regulator:'yes',
                bcd:'s',
                boots:'39',
                fins:'s',
                wetsuit:'s',
                others:'torch'
            }
        ]
        
    }
];
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

let calendarPlugin = () => {
    let customViewConfig = {
        classNames: ['custom-view'],
        needsResourceData: true,
        content: function (props) {
            let segs = testCalendar.sliceEvents(props, true); // allDay=true
            let pools = props.resourceStore;
            let totalDiv = document.createElement('div');
            pools = Object.values(pools);
            //console.log('pools', pools);
            let poolCards = [];
            for (let i = 0; i < pools.length; i++) {
                let pool = {
                    pool_id: pools[i].id,
                    pool_name: pools[i].extendedProps.name
                }
                //console.log('pool', pool);
                let newPoolDiv = document.createElement('div');
                newPoolDiv.classList.add('card');
                newPoolDiv.setAttribute('data-pool-id', pool.pool_id);
                newPoolDiv.innerHTML = poolTemplate({ pool_name: pool.pool_name })
                let classParent = newPoolDiv.querySelector('.class-marker')
                for(let j=0;j<segs.length;j++){
                    //console.log('resourceId',segs[j].def.resourceIds[0])
                    if(pool.pool_id==segs[j].def.resourceIds[0]){
                        //console.log('i am matched');
                        let newClassDiv = document.createElement('div');
                        newClassDiv.classList.add('card');
                        newClassDiv.innerHTML = classTemplate({
                            course_name:segs[j].def.extendedProps.course_name,
                            instructor_name:segs[j].def.extendedProps.instructor_name,
                            booking_session:segs[j].def.extendedProps.booking_session
                        });
                        let studentParent = newClassDiv.querySelector('.student-marker');
                        studentParent.innerHTML = studentTemplate({student:segs[j].def.extendedProps.students});
                        classParent.appendChild(newClassDiv);
                    }
                }
                totalDiv.appendChild(newPoolDiv);

            }
            //console.log('totalDiv',totalDiv);
            
            //console.log('segs', segs);
            //console.log('props', props);
            let html = totalDiv.outerHTML;
            //console.log('html',html);
            // let html =
            //   '<div class="view-title">' +
            //     props.dateProfile.currentRange.start.toUTCString() +
            //   '</div>' +
            //   '<div class="view-events">' +
            //     segs.length + ' events' +
            //   '</div>'

            return { html: html }
        },
        buttonText: 'Gear',
    }

    return testCalendar.createPlugin({
        views: {
            custom: customViewConfig,

        }
    });
}


let poolTemplate = Handlebars.compile(`
    
        <div class="card-header">
            <h3 class="card-title text-center">{{pool_name}}</h3>
            <div class="card-tools">
            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i
                    class="fas fa-minus"></i></button>
            </div> 
        </div>
        <div class="card-body class-marker" >
        
        </div>
`)
let classTemplate = Handlebars.compile(`
<div class="card-header">
<h3 class="card-title text-center">{{course_name}} Instructor: {{instructor_name}} session: {{booking_session}}</h3>
<div class="card-tools">
<button type="button" class="btn btn-tool" data-card-widget="collapse"><i
        class="fas fa-minus"></i></button>
</div> 
</div>
<div class="card-body ">
<table class="table table-bordered text-center">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>name</th>
                                <th>mask</th>
                                <th>regulator</th>
                                <th>bcd</th>
                                <th>wetsuit</th>
                                <th>boots</th>
                                <th>fins</th>
                                <th>others</th>
                            </tr>
                        </thead>
                        <tbody class="student-marker">

                        </tbody>
                    </table>
</div>
`)

let studentTemplate = Handlebars.compile(`
{{#each student}}
<tr>
<th>{{id}}</th>
<th>{{name}}</th>
<th>{{mask}}</th>
<th>{{regulator}}</th>
<th>{{bcd}}</th>
<th>{{wetsuit}}</th>
<th>{{boots}}</th>
<th>{{fins}}</th>
<th>{{others}}</th>
</tr>
{{/each}}
`)

let getData = ()=>{
    let getPool = axios.get('/admin/api/pool');
    let getGear = axios.get('/admin/api/pool/gear/events');
    let getCourse = axios.get('/admin/api/course');
    return Promise.all([getPool,getCourse,getGear]);
}
let eventFormatter = (gearEvent,course)=>{
    
    for(let i=0;i<gearEvent.length;i++){
        let date = new Date(gearEvent[i].start);
        date.setDate(date.getDate()+1);
        gearEvent[i].start = date.toISOString().slice(0,10);
        course.map((item)=>{
            if(item.id==gearEvent[i].course_id){
                delete gearEvent[i].course_id;
                gearEvent[i].course_name=item.course_name;
            }
        })
    }
    return gearEvent;
}