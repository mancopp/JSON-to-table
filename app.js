let stringData = httpGet("https://data.cityofnewyork.us/api/views/yunp-vs8g/rows.json?accessType=DOWNLOAD");
let json = JSON.parse(stringData)

let displayItems = [8, 9, 10, 11, 14, 15, 16, 17, 19]

tableCreate(json);

//Get XMLHttprequest
function httpGet(url)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function tableCreate(obj) {
    //Create first row
    const body = document.body, tbl = document.createElement("table");
    tbl.setAttribute("id", "table");

    const tr = tbl.insertRow();
    const td = tr.insertCell();
    td.classList.add("class1");

    td.appendChild(document.createTextNode("#"));

    for (let i = 0; i < obj.meta.view.columns.length; i++) {
        if(displayItems.includes(i))
        {
            const td = tr.insertCell();

            td.appendChild(document.createTextNode(i + " " + obj.meta.view.columns[i].name));
            td.classList.add("class1");    
        }
    }

    const tddel = tr.insertCell();
    tddel.classList.add("class1");

    //Form to add data rows
    const trf = tbl.insertRow();

    trf.insertCell();
    
        for(let i = 0; i < obj.meta.view.columns.length; i++)
        {
            if(displayItems.includes(i))
            {
                const td = trf.insertCell();
                var x = document.createElement("INPUT");
                x.setAttribute("type", "text");
                x.setAttribute("id", "form" + i);
                td.appendChild(x);    
            }
        }
    
        const tdadd = trf.insertCell();
        var x = document.createElement("BUTTON");
        x.innerText = "add";
        x.setAttribute("onclick", "addFunc(json)");
        tdadd.appendChild(x);  
    
    body.appendChild(tbl);

    //Create data rows
    for(let i = 0; i < obj.data.length; i++)
    {
        const tr = tbl.insertRow();
        tr.classList.add("dataRow");
        tr.setAttribute("id",i);

        const td = tr.insertCell();
        td.appendChild(document.createTextNode(i + 1));

        for(let j = 0; j < obj.meta.view.columns.length; j++)
        {
            if(displayItems.includes(j))
            {
                const td = tr.insertCell();
                td.appendChild(document.createTextNode(obj.data[i][j]));
            }
        }

        const tddel = tr.insertCell();
        var x = document.createElement("BUTTON");
        x.innerText = "edit";
        x.setAttribute("onclick", "editFunc(" + i + ")");
        tddel.appendChild(x);   

    }

}

//Edit row
function editFunc(index)
{
    const elements = Array.from(document.getElementById(index).children)

    for(let i = 1; i < elements.length; i++)
    {
        if(i != elements.length - 1)
        {
            let value =  elements[i].innerText;
            elements[i].innerText = "";

            var x = document.createElement("INPUT");
            x.setAttribute("type", "text");
            x.setAttribute("value", value);
            x.setAttribute("id", "editForm " + i);
            elements[i].appendChild(x);   
        }
        else
        {
            elements[i].removeChild(elements[i].firstChild);

            var x = document.createElement("BUTTON");
            x.innerText = "remove";
            x.setAttribute("onclick", "removeFunc(" + index + ")");
            elements[i].appendChild(x);

            var y = document.createElement("BUTTON");
            y.innerText = "save";
            y.setAttribute("onclick", "saveFunc(" + index + ")");
            elements[i].appendChild(y);
        }
    }
}

//Delete row
function removeFunc(index)
{
    let tr = document.getElementById(index);
    tr.remove();


    const tb = document.getElementById("table").firstChild;
    let tbChildren = Array.from(tb.children);

    for(i = index + 1; i < tbChildren.length; i++)
    {
        tbChildren[i].firstChild.innerText = i - 1;
    }
    
}

//Save changes to row
function saveFunc(index)
{
    let tr = document.getElementById(index);
    let trChildren = Array.from(tr.children);

    for(let i = 1; i < trChildren.length; i++)
    {
        if(i != trChildren.length - 1)
        {
            let input = document.getElementById("editForm " + i);
            let value = input.value;
            input.remove();

            if(value == "")
            {
                value = "null";
            }

            trChildren[i].innerText = value;
        }
        else
        {
            trChildren[i].innerHTML = "";

            var x = document.createElement("BUTTON");
            x.innerText = "edit";
            x.setAttribute("onclick", "editFunc(" + index + ")");
            trChildren[i].appendChild(x);
        }
    }
}

//Add row
function addFunc(obj)
{
    const last = Array.from(document.querySelectorAll(".dataRow")).pop();
    let i = Number(last.id) + 1;
    tbl = document.getElementById("table");

    const tr = tbl.insertRow();
    tr.classList.add("dataRow");
    tr.setAttribute("id",i);

    const td = tr.insertCell();
    td.appendChild(document.createTextNode(i + 1));

    for(let j = 0; j < obj.meta.view.columns.length; j++)
    {
        if(displayItems.includes(j))
        {
            let value = document.getElementById("form" + j).value;
            document.getElementById("form" + j).value = "";

            if(value == "")
            {
                value = "null";
            }
            const td = tr.insertCell();
            td.appendChild(document.createTextNode(value));

        }
    }

    const tddel = tr.insertCell();
    var x = document.createElement("BUTTON");
    x.innerText = "edit";
    x.setAttribute("onclick", "editFunc(" + i + ")");
    tddel.appendChild(x);
}