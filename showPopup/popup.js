const list = document.getElementsByClassName("list")[0];

const createReminder = (name, birthday, reminder) => {
    const li = document.createElement("li") 
    li.id = name + "id";
    li.className = "reminder box is-fullwidth";

    const div = document.createElement("div")
    div.className = "text";
    div.innerText = `${name}\n${birthday}\n${reminder}`

    const actionContainer = document.createElement("div");
    actionContainer.className = "actions";

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete is-small";

    actionContainer.appendChild(deleteButton);
    li.appendChild(div);
    li.appendChild(actionContainer);

    deleteButton.addEventListener("click", function () {
        if(li.id === name + "id") {
            list.removeChild(li);
        }
    });
    
    return li;
}; 

const timeChecker = (time) => {
    const timeStamp = spacetime(time, 'America/New_York');
    const currentTime = spacetime.now();
    return (
        timeStamp.isSame(currentTime, 'month') &&
        timeStamp.isSame(currentTime, 'day') &&
        timeStamp.isSame(currentTime, 'hour') &&
        timeStamp.isSame(currentTime, 'minute')
    ) ? time : '';
};

chrome.storage.local.get('prefs', (result) => { 
    const prefs = result || {};
    for(let key in prefs) {
        const value = prefs[key];
        const newReminder = createReminder(value.name, value.birthday, value.reminder);
        list.appendChild(newReminder);

        if(timeChecker(value.reminder)) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'images/icon48.png',
                title: `${value.name}'s birthday is on ${value.birthday}`,
                message: `Get ${value.name} a small gift :)`,
                priority: 0
            });
        }
    }
});

/*
const timeChecker = (time) => {
    const timeStamp = spacetime(time, 'America/New_York');
    const currentTime = spacetime.now();
    if (timeStamp.isSame(currentTime, 'month') &&
        timeStamp.isSame(currentTime, 'day') &&
        timeStamp.isSame(currentTime, 'hour') &&
        timeStamp.isSame(currentTime, 'minute')) {
        return time;
    } else {
        return '';
    }
};

chrome.storage.local.get(["name", "birthday", "reminder"], (result) => { 

    let { name, birthday, reminder } = result;
    let newReminder = createReminder(name, birthday, reminder);
    list.appendChild(newReminder)
    
    if(timeChecker(reminder)) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/icon48.png',
            title: `${name}'s birthday is on ${birthday}`,
            message: `Get ${name} a small gift :)`,
            priority: 0
        });
    }
});*/