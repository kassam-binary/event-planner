$(document).ready(function () {
    //object for event details
    var events;
    var hosts;
    //get json file(data) for events
    $.getJSON("js/eventsData.json", function (Eventsdata) {
        events = Eventsdata;
        $.getJSON("js/hostsData.json", function (Hostsdata) {
            hosts = Hostsdata;
            //init();
            //getHosts();
            var de = new Date()
            getEvents();
            //getHosts()
            //getNext_Week_event();
            //getNext_Month_event();
            //console.log(events.length+1)
        });
    });
    /**
        DOM content declaration
    **/
    var container = $("#container");
    var databox_container = container.find("#align_databox_container");
    var event_container = databox_container.find("#event_container");
    var form_container = event_container.find("#form_container");
    var submit_holder = form_container.find("#submt_holder");
    var close_button = submit_holder.find("#close_holder");
    var footer = $("#footer_bar");
    var open_button = footer.find("#plus_cycle");
    var drop = databox_container.find(".tag_colour");
    var drop_span = databox_container.find(".down_list");
    var drop_menu = drop_span.find(".dropdown-menu");
    var form = form_container.find("#data_form");
    //prevent form to submit data
    $(form).on("submit", function (e) {
        e.preventDefault();
        create_event()
        $(form)[0].reset()
    });
    /**
     * Creating events
     * @param {number}events_data
     * @return {date} event sorted
     */
    function create_event() {
        //Getting data from the form
        var eventName = $("input[name=event_Name]").val();
        var eventHost = $("input[name=event_Host]").val();
        var eventStart = $("input[name=event_Start]").val();
        var eventEnd = $("input[name=event_End").val();
        //getting lenght of the events object
        var eventLenght = events.length
        //getting lenght of the events object
        var hostLenght = hosts.length
        //generating Event ID
        var event_Id = eventID_generate(eventLenght, events);
        //generating host ID
        var host_Id = hostID_generate(hostLenght, hosts);
        var formHost_Data = {host_id: host_Id,profile_picture: "",username:eventHost};
        hosts.push(formHost_Data);
        
        var formEvent_Data = {event_id: event_Id,title: eventName,starting_date: eventStart,ending_date: eventEnd,host_id: host_Id};
        events.unshift(formEvent_Data);
        setTimeout(function () {
                    return data_box.prepend(getEvent(formEvent_Data,event_Id));
                },200);
    };
     /**
     * Delete event
     * @param {number}_event_id
     * @return {number}
     */
    function delete_event(_event_id){
        $.each(events, function(i,event){
            if(event.event_id == _event_id){
               events.splice(i,1); 
                return;
            }
            
        });
    };
    /**
     * Generating event ID
     * @param {number}id
     * @param {string}event_data
     * @return {number} e_Autonumber
     */
    function eventID_generate(id, event_data) {
        var event_check = false;
        var e_Autonumber;
        for (var i = 0; i < event_data.length; i++) {
            if (event_data[i].event_id == id) {
                event_check = true
                return e_Autonumber = events.length + 1
            };
        };
        if (event_check == false) {
            return e_Autonumber = events.length + 1
        };
    };
    /**
     * Generating host ID
     * @param {number}id
     * @param {string}host_data
     * @return {number} h_Autonumber
     */
    function hostID_generate(id, host_data) {
        var host_check = false;
        var h_Autonumber;
        for (var i = 0; i < host_data.length; i++) {
            if (host_data[i].host_id == id) {
                host_check = true;
                return h_Autonumber = hosts.length + 1
            };
        };
        if (host_check == false) {
            return h_Autonumber = hosts.length + 1
        };
    };
    /**
     * sort event by date
     * @param {number}events_data
     * @return {date} event sorted
     */
    function sortBy_date(events_data) {
        events_data.sort(function (a, b) {
            var date_one = date_formater(a);
            var date_two = date_formater(b);
            return new Date(date_one.start).getTime() - new Date(date_two.start).getTime();
        });
    };
    /**
     * Getting host name
     * @param {number} id 
     * @return {string} host name
     */
    function getHost(id) {
        var hostName;
        $.each(hosts, function (index, host) {
            if (id == host.host_id) {
                hostName = host.username;
                return false;
            }
        });
        return hostName;
    };
    /**
     * Getting all hosts
     * @return {number} host list
     */
    function getHosts(){
        $.each(hosts, function(index,host){
               console.log(getHost(host.host_id));
            var host_list ="";
               host_list+= "<div class='event_list_box'>"+
                    "<div class='date_holder'>"+
                        "<div class='event_day arange_details'></div>"+
                    "</div>"+
                    "<div class='details_holder'>"+
                        "<div class='title_box move_box'>Host Name</div>"+
                        "<div class='host_box move_box'>"+getHost(host.host_id)+"</div>"+
                    "</div>"+
                    "<div class='delete_btn'>"+
                        "<div class='icon_holder'>"+
                            "<div class='delet_icon'>"+
                            "<i class='fa fa-trash fa-2x' aria-hidden='true'></i>"+
                            "</div>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
        "</div>";
            setTimeout(function () {
                    return data_box.append(host_list);
                }, 400 + 100 * index);
            
               });
    };
    /**
     * Getting week number
     * @param {date} d 
     * @return {number} weeknumber
     */
    function getWeekNumber(d) {
        // Copy date so don't modify original
        d = new Date(+d);
        d.setHours(0, 0, 0, 0);
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        // Get first day of year
        var yearStart = new Date(d.getFullYear(), 0, 1);
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        // Return array of year and week number
        return weekNo;
        //console.log(weekNo)
    };
    /**
     * date formating
     * @param {String} event 
     * @return {date} full_date into ISO format
     */
    function date_formater(event) {
        var date = event.starting_date;
        var remove_slash = date.split("/");
        var day = remove_slash[0];
        var month = remove_slash[1];
        var year = remove_slash[2];
        //console.log(day);
        var iso_format = year + "-" + month + "-" + day;
        var full_date = new Date(iso_format)
        return full_date;
    };
    /**
     * Getting event
     * @param {String} event 
     * @return {String} event_list
     */
    function getEvent(event, index) {
        var myDate = date_formater(event);
        var event_list = "";
        event_list += "<div class=\'event_list_box\' data-event-id="+event.event_id+">" + "<div class=\'date_holder\'>" + "<div class=\'event_month arange_details\'>" + getmonth_name(myDate.getMonth()) + "</div>" + "<div class=\'event_day arange_details\'>" + myDate.getDate() + "</div>" + "<div class=\'event_year arange_details\'>" + myDate.getFullYear() + "</div>" + "</div>" + "<div class=\'details_holder\'>" + "<div class=\'title_box move_box\'>" + event.title + "</div>" + "<div class=\'host_box move_box\'>" + "Hosted by " + getHost(event.host_id) + "</div>" + "</div>" + "<div class=\'delete_btn\'>" + "<div class=\'icon_holder\' id=\'delete_event\'>" + "<div class=\'delet_icon\'>" + "<i class=\'fa fa-trash fa-2x\' aria-hidden=\'true\'></i>" + "</div>" + "</div>" + "</div>" + "</div>";
        //console.log("ziko "+menu_" +index +");
        return event_list;
    };
    //event box container
    var data_box = $("#event_list_container");
    /**
     * Getting events
     * @param {date} starting_date 
     * @param {date} finishing_date
     * @return {string} GetEvent(event)
     */
    var check = false;
    var checkFor_event = false;

    function getEvents(starting_date, finishing_date) {
        if (!starting_date && !finishing_date) {
            //default loading events
            $.each(events, function (index, event) {
                var today_date = new Date()
                var _date = date_formater(event);
                check_todayEvent(today_date, _date, event);
                if (today_date.getDate() == _date.getDate() && today_date.getMonth() == _date.getMonth()) {
                    //do not print
                    return true;
                };
                setTimeout(function () {
                    return data_box.append(getEvent(event, index));
                }, 400 + 100 * index);
            });
        }
        else if (starting_date && finishing_date) {
            //specific oading events
            $.each(events, function (index, event) {
                var event_start_date = date_formater(event);
                if (event_start_date > starting_date && event_start_date < finishing_date) {
                    checkFor_event = true;
                    setTimeout(function () {
                        return data_box.append(getEvent(event, index));
                    }, 400 + 100 * index);
                }
                else {
                    //checkFor_event = false; 
                }
            });
            if (checkFor_event == false) {
                //console.log("akuna")
                data_box.html("No Event to Display")
            };
        };
        if (check == false) {
            // print error
            $("#active_bar").html("No event for today")
        };
    };
    /**
     * Getting today events
     * @param {date} today_date 
     * @param {date} event_date
     * @param {date} event_detail
     * @return {string} active_event
     */
    function check_todayEvent(today_date, event_date, event_detail) {
        if (today_date.getDate() == event_date.getDate() && today_date.getMonth() == event_date.getMonth()) {
            check = true;
            var active_event = "<div id=\'active_event\'>" + "<div class=\'date_holder\'>" + "<div class=\'event_month arange_details active_date\'>" + getmonth_name(event_date.getMonth()) + "</div>" + "<div class=\'event_day arange_details\'>" + event_date.getDate() + "</div>" + "<div class=\'event_year arange_details active_date\'>" + event_date.getFullYear() + "</div>" + "</div>" + "<div class=\'details_holder\'>" + "<div class=\'title_box move_box\'>" + event_detail.title + "</div>" + "<div class=\'host_box move_box\'>" + "Hosted by " + getHost(event_detail.host_id) + "</div>" + "</div>" + "<div class=\'delete_btn close\'>" + "<div class=\'icon_holder\'></div>" + "</div>" + "</div>";
            $("#align_databox_container #active_bar").append(active_event);
            //$("#active_bar").html("Today")
        }
        else {
            //check = false;
            //console.log("No event for today");
        };
    };
    /**
     * Get Net week event
     * @return {string} next week events
     */
    function getNext_Week_event() {
        data_box.empty();
        var today_date = new Date();
        var endof_week = new Date();
        endof_week.setDate(endof_week.getDate() + 7);
        return getEvents(today_date, endof_week)
    };
    /**
     * Get next month event
     * @return {string} next month events
     */
    function getNext_Month_event() {
        var today_date = new Date();
        //Get the first day of the month
        var currentMonth_date = new Date();
        currentMonth_date.getMonth();
        currentMonth_date.setMonth((currentMonth_date.getMonth() + 1));
        currentMonth_date.setDate(1);
        //Get the last day of the month
        var endof_currentMonth = new Date();
        endof_currentMonth.getMonth();
        endof_currentMonth.setMonth((endof_currentMonth.getMonth() + 1));
        endof_currentMonth.setDate(1);
        var endofMont_date = endof_currentMonth.getDate() + 30
        endof_currentMonth.setDate(endofMont_date);
        return getEvents(currentMonth_date, endof_currentMonth);
    };
    /**
     * Get month name
     * @param {Number} month_number 
     * @return {string} month_name
     */
    function getmonth_name(month_number) {
        var month_name = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return month_name[month_number];
    }
    $(drop).on("click", function () {
        if ($(".dropdown-menu").hasClass("drop_open")) {
            $(".dropdown-menu").removeClass("drop_open");
            //$(".dropdown-menu").addClass("closeZoom");
            $(".dropdown-menu").css("display", "none");
        }
        else {
            $(".dropdown-menu").addClass("drop_open");
            $(".dropdown-menu").css("display", "block");
        };
    });
    $(open_button).on("click", function () {
        event_container.addClass("expand");
        event_container.removeClass("collap")
        event_container.css("display", "block");
        $(this).removeClass("plusIn");
        $(this).addClass("plusOut");
        fade_();
    })
    $(close_button).on("click", function () {
        if (event_container.hasClass("expand")) {
            event_container.removeClass("expand").addClass("collap");
        }
        $(open_button).addClass("openBtn");
        $(open_button).removeClass("plusOut");
        $(open_button).css("display", "block");
    });

    function fade_() {
        setTimeout(function () {
            open_button.css("display", "none");
        }, 1000);
    };
    $(data_box).delegate("#next_wek", "click", function () {
        getNext_Week_event();
    });
    $("#next_wek").on("click", function () {
        $(".dropdown-menu").css("display", "none");
        $("#event_title").html("Next Week Events");
        getNext_Week_event()
    });
    $("#upcominEvent").on("click", function () {
        $(".dropdown-menu").css("display", "none");
        $("#event_title").html("Upcoming Events");
        data_box.empty();
        $("#active_bar").empty();
        getEvents();
    });
    $("#next_month").on("click", function () {
        $(".dropdown-menu").css("display", "none");
        $("#event_title").html("Next Month Events");
        data_box.empty();
        $("#active_bar").empty();
        getNext_Month_event();
    });

    $(data_box).delegate("#delete_event", "click", function (e) {
        
        var event_id = $(this).parent().parent().attr("data-event-id");
        $(this).parent().parent().fadeOut("fast");//css("display","none")
        //events.splice(id, 1);
        delete_event(event_id)

    });
    
     $("#user_tag").on("click", function () {
        $("#event_title").html("Event hoster");
        $("#dropdown_cont").css("display","none")
         data_box.empty();
        getHosts()
    });
})