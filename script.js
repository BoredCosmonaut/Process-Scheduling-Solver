
var output = document.getElementById("result");
var pInputs = document.getElementById(".processesess-input");
var inputValues = [];
var enterValues = []
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

class Process
{
    constructor(bt,art)
    {
        this.bt = bt;    // Burst Time
        this.art = art;    // Arrival Time
    }
}

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
        let processesessesArray = [];
        for(let i = 0; i < 5; i++) {
            const processesess = {
                processescesesTime : inputValues[i],
                priority: parseFloat(document.getElementById(`p${i+1}p`).value),  
            }
            processesessesArray[i] = processesess;
        }
        output.innerText = OPA(processesessesArray);
        inputValues = cleanArray(inputValues);
    } else if(value == "KSJF") {
        console.log("In the ksjf");
        for(let i = 0; i < 5; i++) {
        enterValues[i] = parseFloat(document.getElementById(`p${i+1}e`).value);
        console.log(inputValues[i]);
        }
        processes = [];
        for(let i = 0; i < 5; i++) {
            processes[i] = new Process(inputValues[i],enterValues[i]);
        }
        output.innerText = KSJF(processes);
        inputValues = cleanArray(inputValues);
    }
})

//İlk gelen önce
function FCFS(processesceses) {
    let toplam = 0
    let currentTime = 0;
    for(let i = 1; i < 5;i++) {
        currentTime = currentTime + parseFloat(processesceses[i]);
        toplam = toplam + parseFloat(currentTime);
        console.log(`i:${i},current time: ${currentTime}, toplam: ${toplam}`);
    }
    console.log(toplam)
    return toplam / 5;
}

//Kısa süreli önce
function SJF(processesceses) {
    sortedArray = processesceses.sort();
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
function LTA(processesceses,timeFrame) {
    //Bekleme sürelerini eklediğimiz dizi
    let wt = [];
    //Kalan sürelerin olduğu dizi
    let remaningTime = processesceses;
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
                    wt[i] = t - processesceses[i];

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

function OPA(processesesses) {
    let toplam = 0;
    let waitingArray = [];
    waitingArray[0] = 0;
    //Bubble sort kullanarak süreleri ve öncelikleri ayarlarız
    for (let i = 0; i < processesesses.length - 1; i++) {
        for (let j = 0; j < processesesses.length - i - 1; j++) {
            if (processesesses[j].priority > processesesses[j + 1].priority) {
                // Swap the processesesses
                let temp = processesesses[j];
                processesesses[j] = processesesses[j + 1];
                processesesses[j + 1] = temp;
            }
        }
    }

    for(let i = 1; i < 5; i++) {
        waitingArray[i] = parseFloat(processesesses[i-1].processescesesTime) + waitingArray[i - 1];
    }

    // Print waiting times
    console.log("Waiting times for each processesess:");
    for (let i = 0; i < processesesses.length; i++) {
        toplam +=  waitingArray[i];
    }
    return toplam / 5;
}

function KSJF(processes) {
    let wt = []; // Bekleme sürelerini tutacak dizi
    let n = processes.length; // İşlem sayısı
    let rt = new Array(n); // Kalan zamanları tutacak dizi

    // Burst sürelerini rt dizisine kopyala
    for (let i = 0; i < n; i++) {
        rt[i] = processes[i].bt;
    }

    let complete = 0; // Tamamlanmış işlem sayısı
    let t = 0; // Geçen zaman
    let minm = Number.MAX_VALUE; // Minimum kalan süre
    let shortest = 0; // En kısa süreli işlemi tutacak değişken
    let check = false; // İşlem bulunup bulunmadığını kontrol eder

    // Tüm işlemler tamamlanana kadar devam et
    while (complete != n) {
        // Mevcut zaman t'ye kadar gelmiş olan işlemler arasında en kısa kalan süreyi bul
        for (let j = 0; j < n; j++) {
            if ((processes[j].art <= t) && (rt[j] < minm) && rt[j] > 0) {
                minm = rt[j];
                shortest = j;
                check = true;
            }
        }

        // Eğer uygun bir işlem bulunamazsa, zamanı artır
        if (check == false) {
            t++;
            continue;
        }

        // Kalan süreyi bir azalt
        rt[shortest]--;

        // Minimum kalan süreyi güncelle
        minm = rt[shortest];
        if (minm == 0)
            minm = Number.MAX_VALUE;

        // Eğer bir işlem tamamen bittiyse
        if (rt[shortest] == 0) {
            // Tamamlanan işlem sayısını artır
            complete++;
            check = false;

            // Mevcut işlemin bitiş zamanını bul
            let finish_time = t + 1;

            // Bekleme süresini hesapla
            wt[shortest] = finish_time - processes[shortest].bt - processes[shortest].art;

            // Bekleme süresi negatif olamaz
            if (wt[shortest] < 0)
                wt[shortest] = 0;
        }

        // Zamanı artır
        t++;
    }

    // Toplam bekleme süresini hesapla
    let totalWait = 0;
    for (let i = 0; i < n; i++) {
        totalWait += wt[i];
    }
    
    console.log(`Ortalama Bekleme Süresi: ${totalWait / n}`);
    return totalWait / n; // Ortalama bekleme süresi
}

function cleanArray(processesceses) {
    for(let i = 0; i <processesceses.length; i++) {
        processesceses[i] = 0;
    }
    return processesceses;
}
