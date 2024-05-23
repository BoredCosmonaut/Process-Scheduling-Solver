
var output = document.getElementById("result");
var pInputs = document.getElementById(".process-input");
var inputValues = [];
var priMap = new Map();
var e = document.getElementById("algorithm");
var text = "";
var value = "";
document.getElementById("algorithm").addEventListener("change", () => {
    value = e.value;
    text = e.options[e.selectedIndex].text;
    if(value == "FCFS"){
        document.getElementById("enter-time").style.display = "none";
        document.getElementById("time-period").style.display = "none"
        document.getElementById("priority").style.display = "none";  
    }
    else if(value == "DPA") {
        document.getElementById("time-period").style.display = "block"
        document.getElementById("priority").style.display = "none";
        document.getElementById("enter-time").style.display = "none";
    } else if ( value == "OPA") {
        document.getElementById("priority").style.display = "flex";
        document.getElementById("time-period").style.display = "none";
        document.getElementById("enter-time").style.display = "none";
    } else if ( value == "KSJF") {
        document.getElementById("enter-time").style.display = "flex";
        document.getElementById("time-period").style.display = "none"
        document.getElementById("priority").style.display = "none";
    } else if (value == "SJF") {
        document.getElementById("enter-time").style.display = "none";
        document.getElementById("time-period").style.display = "none"
        document.getElementById("priority").style.display = "none";   
    }
})

document.getElementById("calculate").addEventListener("click", () => {
    var e = document.getElementById("algorithm");
    value = e.value;
    text = e.options[e.selectedIndex].text;
    console.log(text + "," + value)
    for(let i = 0; i < 5; i++) {
        inputValues[i] = parseFloat(document.getElementById(`p${i+1}`).value);
        console.log(inputValues[i]);
    }
    console.log(text);
    if(value == "FCFS") {
        console.log("in the fcfs");
        output.innerText = FCFS(inputValues);
        inputValues = cleanArray(inputValues);
    } else if (value == "SJF") {
        console.log("In the sjf");
        output.innerText = SJF(inputValues);
        inputValues = cleanArray(inputValues);
    } else if(value == "DPA") {
        document.getElementById("time-period").style.display = "none"
        console.log("inside DPA")
        var timeFrame = document.getElementById("time-period").value;
        output.innerText = LTA(inputValues,timeFrame);
        inputValues = cleanArray(inputValues);
    } else if(value == "OPA") {
        let processesArray = [];
        for(let i = 0; i < 5; i++) {
            const process = {
                proccesesTime : inputValues[i],
                priority: parseFloat(document.getElementById(`p${i+1}p`).value),  
            }
            processesArray[i] = process;
        }
        output.innerText = OPA(processesArray);
        inputValues = cleanArray(inputValues);
    } else if(value == "KSJF") {
        console.log("In the ksjf");
        output.innerText = KSJF(inputValues);
        inputValues = cleanArray(inputValues);
    }
})

//İlk gelen önce
function FCFS(procceses) {
    let toplam = 0
    let currentTime = 0;
    for(let i = 1; i < 5;i++) {
        currentTime = currentTime + parseFloat(procceses[i]);
        toplam = toplam + parseFloat(currentTime);
        console.log(`i:${i},current time: ${currentTime}, toplam: ${toplam}`);
    }
    console.log(toplam)
    return toplam / 5;
}

//Kısa süreli önce
function SJF(procceses) {
    sortedArray = procceses.sort();
    console.log(sortedArray);
    let toplam = 0;
    let currentTime = 0;
    for(let i = 0; i < 4;i++) {
        currentTime = currentTime + parseFloat(sortedArray[i]);
        toplam = parseFloat(toplam) + parseFloat(currentTime);
        console.log(`i:${i},current time: ${currentTime}, toplam: ${toplam}, current Length: ${sortedArray[i]}`);
    }
    console.log(toplam)
    return toplam / 5;    
}

//Zaman döngülü algoritma
function LTA(procceses,timeFrame) {
    //Bekleme sürelerini eklediğimiz dizi
    let wt = [];
    //Kalan sürelerin olduğu dizi
    let remaningTime = procceses;
    //Current time
    let t = 0;
    //Bütün işlemler tamamlanana kadar döngüyü çalıştırır
    while(1) {
        let done = true;
        //İşlem miktarı kadar çalıştırır
        for(let i = 0; i < 5;i++) {

            //Eğer kalan süre 0 dan büyükse yani zaman aralığından fazla ise buraya gir
            if(remaningTime[i] > 0) {
                done = false;

                //Kalan zaman, zaman aralığından büyükse buraya gir
                if(remaningTime[i] > timeFrame) {
                    //T nin miktarını arttır bir işlemin işlendiği süre kadar.
                    t += timeFrame;
                    //İşlemden zaman aralığını çıkar
                    remaningTime[i] -= timeFrame;
                } else {
                    //Eğer işlemin kalan süresi zaman aralığından küçükse toplam süreye kalan işlemin süresini ekle
                    t = t + remaningTime[i];

                    //Bekleme süresini diziye ekliyoruz
                    wt[i] = t - procceses[i];

                    //Kalan süreyi 0 a ekliyoruz
                    remaningTime[i] = 0;
                }
            }
        }
        //İşlem bittiğinde döngüden çık
        if(done == true) {
            break;
        }
    }
    let toplam = 0;
    for(let i = 0; i < 5 ;i++) {
        toplam += wt[i];
    }
    console.log(toplam);
    return toplam / 5;
}

function OPA(processes) {
    let toplam = 0;
    let waitingArray = [];
    waitingArray[0] = 0;
    //Bubble sort kullanarak süreleri ve öncelikleri ayarlarız
    for (let i = 0; i < processes.length - 1; i++) {
        for (let j = 0; j < processes.length - i - 1; j++) {
            if (processes[j].priority > processes[j + 1].priority) {
                // Swap the processes
                let temp = processes[j];
                processes[j] = processes[j + 1];
                processes[j + 1] = temp;
            }
        }
    }

    for(let i = 1; i < 5; i++) {
        waitingArray[i] = parseFloat(processes[i-1].proccesesTime) + waitingArray[i - 1];
    }

    // Print waiting times
    console.log("Waiting times for each process:");
    for (let i = 0; i < processes.length; i++) {
        toplam +=  waitingArray[i];
    }
    return toplam / 5;
}

// Kesilmeli SJF (Preemptive Shortest Job First) Algorithm
function KSJF(processes) {
    let n = processes.length;
    let remainingTime = [...processes]; // Kalan işlem süreleri
    let waitingTime = new Array(n).fill(0); // Bekleme süreleri
    let completionTime = new Array(n).fill(0); // Tamamlanma süreleri
    let currentTime = 0; // Şu anki zaman
    let completed = 0; // Tamamlanan işlemler
    let shortest = -1; // En kısa işlem
    let finishTime; // Bitirme zamanı

    while (completed != n) {
        // En kısa kalan süresi olan işlemi bul
        let minm = Number.MAX_SAFE_INTEGER;
        for (let j = 0; j < n; j++) {
            if ((remainingTime[j] > 0) && (processes[j] <= currentTime) && (remainingTime[j] < minm)) {
                minm = remainingTime[j];
                shortest = j;
            }
        }

        if (shortest == -1) {
            currentTime++;
            continue;
        }

        // En kısa işlemin kalan süresini azalt
        remainingTime[shortest]--;

        // Eğer işlem tamamlanmışsa
        if (remainingTime[shortest] == 0) {
            completed++;
            finishTime = currentTime + 1;
            completionTime[shortest] = finishTime;
            waitingTime[shortest] = finishTime - processes[shortest];
        }

        // Zamanı artır
        currentTime++;
    }

    // Toplam bekleme süresini hesapla
    let totalWait = 0;
    for (let i = 0; i < n; i++) {
        waitingTime[i] -= processes[i];
        totalWait += waitingTime[i];
    }
    return totalWait / n;
}

function cleanArray(procceses) {
    for(let i = 0; i <procceses.length; i++) {
        procceses[i] = 0;
    }
    return procceses;
}