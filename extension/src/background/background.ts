
// // chrome.tabs.query({active: true, currentWindow: false}, function(tabs){
// //     console.log(tabs, "id");
    
// //     chrome.tabs.sendMessage(tabs[0].id, {action: "snooze_ended"}, function(response) {});  
// // });

// chrome.runtime.onInstalled.addListener(() => {
//     chrome.alarms.create('refresh', { periodInMinutes: 1 });
    


    
// });
// // chrome.tabs.onCreated.addListener((alarm) => {
// //     console.log("alarm.name"); // refresh
// //     console.log();
// //     checkIfSnoozeIsOver().then((result) => {
        
// //         if (!result) {
// //             // console.log(chrome.tabs);
// //             setTimeout(function() {
// //                 chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
// //                 console.log(tabs[0].id, "id");
                
// //                 chrome.tabs.sendMessage(tabs[0].id, {action: "snooze_ended"}, function(response) {});  
// //                 });
// //             }

// //             , 5000)
// //             chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
// //                 console.log(tabs[0].id, "id");
                
// //                 chrome.tabs.sendMessage(tabs[0].id, {action: "snooze_ended"}, function(response) {});  
// //             });
// //         }
// //     })
     
    
// //   });



// chrome.alarms.onAlarm.addListener((alarm) => {
//     console.log(alarm.name); // refresh
//     console.log("alarm.name"); // refresh

//     // chrome.storage.local.get("snoozeStart").then((result) => {
//     //     console.log(result.snoozeStart);
//     //   });
//     setInterval(function(){
//         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//             console.log(tabs);
//             checkIfSnoozeIsOver().then((result) => {
        
//                 // if (!result) {
//                     // console.log(chrome.tabs);
//                         chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//                         console.log(tabs[0].id, "id");
                        
//                         chrome.tabs.sendMessage(tabs[0].id, {messsage: "snooze_ended"}, function(response) {});  
//                         });
//                     // }
//                 })
//             })

            
//     }, 5000)
//   });

// async function checkIfSnoozeIsOver() {
//     let snoozeEnd = null
//     await chrome.storage.local.get("snoozeEnd").then((result) => {
//         console.log(result);
        
//         snoozeEnd = result.snoozeEnd;
//       });
//     const currentUTC = new Date().getTime()
//     // console.log(currentUTC, snoozeEnd);

//     // console.log(currentUTC >= snoozeEnd);
//     return currentUTC >= snoozeEnd
    
    


// }

// setInterval(function(){
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         console.log(tabs);
        
//         var activeTab = tabs[0];
//         chrome.tabs.sendMessage(activeTab.id, {"message": "hello"});
//       });
// }, 1000)