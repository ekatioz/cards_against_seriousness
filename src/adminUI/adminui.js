

function elm(tag, text = '', classname = '') {
    var element = document.createElement(tag);
    element.innerText = text;
    element.className = classname;
    return element;
}

function httpErrorCheck(resp) {
    if (resp.ok) return resp.json();
    else throw Error(resp.statusText);
}

function updateUserlist() {
    const userlist = document.getElementById('userlist');
    userlist.innerHTML = '';
    fetch('/userlist')
        .then(httpErrorCheck)
        .then(list => list.forEach(user => addUserToUserlist(user)))
        .catch(window.alert);
}

function addUserToUserlist(user) {
    const userlist = document.getElementById('userlist');
    var row = elm('tr');
    var name = elm('td', user.name);
    var kick = elm('td', '❌', 'kick');
    kick.addEventListener('click', e => {
        fetch(`/kick?id=${user.id}`)
            .then(httpErrorCheck)
            .then(updateUserlist)
            .catch(window.alert);
    });
    row.appendChild(name);
    row.appendChild(kick);
    userlist.appendChild(row);
}