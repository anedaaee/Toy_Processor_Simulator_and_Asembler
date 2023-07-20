
let prevA = 0
let A = 0
let ABinary = ''
let PrevT = 0
let T = 0
let TBinary = ''
let C = 0
let Z = 0
let pc = 0
let pcBinary = 0;
let result = [];
let instructure = '';
let loadData ='' ;
let loadDataBinary = 0;

const showError2 = async (error) => {
    let htmlString = `<h3 style="margin:10px;color:red;text-align:center;">${error}</h3>`
    const tableDiv = document.getElementById('result')
    tableDiv.innerHTML = htmlString;
    throw new Error(error)
}
const convertTo17BitBinary = async (number) => {
    let binaryString = number.toString(2);
    let paddedBinary = binaryString.padStart(17, '0');
    return paddedBinary;
}
const convertBinaryToDecimal = async (binary) => {
    const decimalNumber = parseInt(binary, 2);
    return decimalNumber
}
const readFile = async (lines) => {
    let flag = -1;
    for (let i = 0; i < lines.length - 1; i++) {
        let lineSplit = lines[i].split(' ');
        if( lineSplit[0]==='Machin'){
            flag = 0
        }else if(lineSplit[0] === 'Variable'){
            flag = 1
        }else if (lineSplit[0] === 'memory'){
            flag  = 2
        }else{
            if(flag === 1){
                data.push({
                    address : lineSplit[0],
                    name : lineSplit[1]

                })
            }else if (flag === 0){
                machinString.push({
                    address : lineSplit[0],
                    code : lineSplit[1],
                    Comment : lineSplit[2],
                })
            }else if (flag === 2){
                memory.push({
                    address : lineSplit[0],
                    value : lineSplit[1]
                })
            }
        }
    }
}
const getStartAddress = async () =>{
    for(const d of data){
        if(d.name === 'START'){
            return d.address
        }
    }
    return false;
}
const getFinishAddress = async () =>{
    for(const d of data){
        if(d.name === 'FINISH'){
            return d.address
        }
    }
    return false;
}
const readFromMemory = async (address) => {
    for (const mem of memory){
        if(mem.address === address){
            return mem.value
        }
    }
    return false
}
const storeInMemory = async (address,value) => {
    let flag = true;
    for (const mem of memory){
        if(mem.address == address){
            mem.value = value;
            flag = false;
            break;
        }
    }
    if(flag){
        data.push({
            address : address,
            value : value
        })
    }
}
const handleINS = async (op,src) => {
    if(op === '0000'){
        pcBinary = src
        pc = await convertBinaryToDecimal(src)
        result.push({
            op : `JMP PC:=${pcBinary}`,
            A : A,
            T : T,
            ABinary : ABinary,
            TBinary : TBinary,
            Z : Z,
            C : C,
            pc : pcBinary
        })
    }else if(op === '0001'){
        loadDataBinary = await readFromMemory(src);
        if(loadDataBinary){
            prevA = A
            loadData = await convertBinaryToDecimal(loadDataBinary)
            A += loadData
            ABinary = await convertTo17BitBinary(A)
            C = ABinary.charAt(0)
            ABinary = ABinary.substring(1)
            A = await convertBinaryToDecimal(ABinary)
            if(A === 0){
                Z = 1
            }else {
                Z = 0
            }
            result.push({
                op : `ADC A:=${prevA} + ${loadData}`,
                A : A,
                T : T,
                ABinary : ABinary,
                TBinary : TBinary,
                Z : Z,
                C : C,
                pc : pcBinary
            })
        }else{
            let error = `SIMULAT ERROR :\nthere is no data in memory at ${src}`
            await showError2(error)
        }
    }else if(op === '0010'){
        loadDataBinary = await readFromMemory(src);
        if(loadDataBinary){
            prevA = A
            loadData = await convertBinaryToDecimal(loadDataBinary)
            A = A ^ loadData
            ABinary = await convertBinaryToDecimal(A)
            if (A === 0){
                Z = 1
            }else {
                Z = 0
            }
            result.push({
                op : `XOR A:=${prevA} xor ${loadData}`,
                A : A,
                T : T,
                ABinary : ABinary,
                TBinary : TBinary,
                Z : Z,
                C : C,
                pc : pcBinary
            })
        }else{
            let error = `SIMULAT ERROR :\nthere is no data in memory at ${src}`
            await showError2(error)
        }
    }else if(op === '0011'){
        loadDataBinary = await readFromMemory(src);
        if(loadDataBinary){
            prevA = A
            loadData = await convertBinaryToDecimal(loadDataBinary)
            A = A - loadData - C
            ABinary = await convertTo17BitBinary(A)
            C = ABinary.charAt(0)
            ABinary = ABinary.substring(1)
            A = await convertBinaryToDecimal(ABinary)
            if (A === 0){
                Z = 1
            }else {
                Z = 0
            }
            result.push({
                op : `SBC A:=${prevA} - ${loadData} - ${C}`,
                A : A,
                T : T,
                ABinary : ABinary,
                TBinary : TBinary,
                Z : Z,
                C : C,
                pc : pcBinary
            })
        }else{
            let error = `SIMULAT ERROR :\nthere is no data in memory at ${src}`
            await showError2(error)
        }
    }else if(op === '0100'){
            prevA = A
            let prevC = C
            C = ABinary.charAt(15)
            for(let i = ABinary.length -1 ; i >= 1 ; i--){
                let prevI = ABinary.charAt(i - 1)
                ABinary = ABinary.substring(0,i) + prevI + ABinary.substring(i+1)
            }
            ABinary = prevC + ABinary.substring(1)
            A = await convertBinaryToDecimal(ABinary)
            if (A === 0){
                Z = 1
            }else {
                Z = 0
            }
            result.push({
                op : `ROR AC := ${C} ${prevA}`,
                A : A,
                T : T,
                A : ABinary,
                T : TBinary,
                Z : Z,
                C : C,
                pc : pcBinary
            })
    }else if(op === '0101'){
        if(loadDataBinary){
            prevT = T
            T = A
            TBinary = await convertTo16BitBinary(T)
            result.push({
                op : `TAT T:=${ABinary}`,
                A : A,
                T : T,
                ABinary : ABinary,
                TBinary : TBinary,
                Z : Z,
                C : C,
                pc : pcBinary
            })
        }else{
            let error = `SIMULAT ERROR :\nthere is no data in memory at ${src}`
            await showError2(error)
        }
    }else if(op === '0110'){
        loadDataBinary = await readFromMemory(src);
        if(loadDataBinary){
            prevA = A
            loadData = await convertBinaryToDecimal(loadDataBinary)
            A = A | loadData
            ABinary = await convertTo16BitBinary(A)
            if (A === 0){
                Z = 1
            }else {
                Z = 0
            }
            result.push({
                op : `OR A := ${prevA} or ${loadData}`,
                A : A,
                T : T,
                ABinary : ABinary,
                TBinary : TBinary,
                Z : Z,
                C : C,
                pc : pcBinary
            })
        }else{
            let error = `SIMULAT ERROR :\nthere is no data in memory at ${src}`
            await showError2(error)
        }
    }else if(op === '1000'){
        loadDataBinary = await readFromMemory(src);
        if(loadDataBinary){
            prevA = A
            loadData = await convertBinaryToDecimal(loadDataBinary)
            A = A & loadData
            ABinary = await convertTo16BitBinary(A)
            if (A === 0){
                Z = 1
            }else {
                Z = 0
            }
            result.push({
                op : `AND A := ${prevA} and ${loadData}`,
                A : A,
                T : T,
                ABinary : ABinary,
                TBinary : TBinary,
                Z : Z,
                C : C,
                pc : pcBinary
            })
        }else{
            let error = `SIMULAT ERROR :\nthere is no data in memory at ${src}`
            await showError2(error)
        }
    }else if(op === '1001'){
        loadDataBinary = await readFromMemory(src);
        if(loadDataBinary){
            loadData = await convertBinaryToDecimal(loadDataBinary)
            A = loadData
            ABinary =await convertTo16BitBinary(A)
            C = 0
            if (A === 0){
                Z = 1
            }else {
                Z = 0
            }
            result.push({
                op : `AND A := ${loadData}`,
                A : A,
                T : T,
                ABinary : ABinary,
                TBinary : TBinary,
                Z : Z,
                C : C,
                pc : pcBinary
            })
        }else{
            let error = `SIMULAT ERROR :\nthere is no data in memory at ${src}`
            await showError2(error)
        }
    }else if(op === '1010'){
        loadDataBinary = await readFromMemory(src);
        if(loadDataBinary){
            if(C === 1){
                pcBinary = loadDataBinary.substring(4)
                pc = await convertBinaryToDecimal(pcBinary)
                result.push({
                    op : `BCC C == 1 TRUE => JUMP => pc = ${pcBinary}`,
                    A : A,
                    T : T,
                    ABinary : ABinary,
                    TBinary : TBinary,
                    Z : Z,
                    C : C,
                    pc : pcBinary
                })
            }else{
                result.push({
                    op : `BCC C == 1 FALSE =>NOT JUMP => pc = ${await convertTo12BitBinary(pc+1)}`,
                    A : A,
                    T : T,
                    ABinary : ABinary,
                    TBinary : TBinary,
                    Z : Z,
                    C : C,
                    pc : pcBinary
                })
            }
        }else{
            let error = `SIMULAT ERROR :\nthere is no data in memory at ${src}`
            await showError2(error)
        }
    }else if(op === '1011'){
        loadDataBinary = await readFromMemory(src);
        if(loadDataBinary){
            if(Z === 0){
                pcBinary = loadDataBinary.substring(4)
                pc = await convertBinaryToDecimal(pcBinary)
                result.push({
                    op : `BNE Z == 0 TRUE => JUMP => pc = ${pcBinary}`,
                    A : A,
                    T : T,
                    ABinary : ABinary,
                    TBinary : TBinary,
                    Z : Z,
                    C : C,
                    pc : pcBinary
                })
            }else{
                result.push({
                    op : `Z == 0 FALSE =>NOT JUMP => ${await convertTo12BitBinary(pc + 1)}`,
                    A : A,
                    T : T,
                    ABinary : ABinary,
                    TBinary : TBinary,
                    Z : Z,
                    C : C,
                    pc : pcBinary
                })
            }
        }else{
            let error = `SIMULAT ERROR :\nthere is no data in memory at ${src}`
            await showError2(error)
        }
    }else if(op === '1100'){
        loadDataBinary = await readFromMemory(ABinary.substring(4));
        if(loadDataBinary){
            prevA = A
            loadData = await convertBinaryToDecimal(loadDataBinary)
            A = loadData
            ABinary = loadDataBinary
            if(A === 0){
                Z = 1
            }else {
                Z = 0
            }
            result.push({
                op : `LDI A:= ${loadData}`,
                A : A,
                T : T,
                ABinary : ABinary,
                TBinary : TBinary,
                Z : Z,
                C : C,
                pc : pcBinary
            })
        }else{
            let error = `SIMULAT ERROR :\nthere is no data in memory at ${src}`
            await showError2(error)
        }
    }else if(op === '1101'){
        await storeInMemory(ABinary.substring(4),TBinary)
        result.push({
            op : `STT Insert ${T} at ${ABinary.substring(4)}`,
            A : A,
            T : T,
            ABinary : ABinary,
            TBinary : TBinary,
            Z : Z,
            C : C,
            pc : pcBinary
        })
    }else if(op === '1110'){
        loadDataBinary = await readFromMemory(src);
        if(loadDataBinary){
            prevA = A
            loadData = await convertBinaryToDecimal(loadDataBinary)
            A = loadData
            ABinary = loadDataBinary
            if(A === 0){
                Z = 1
            }else {
                Z = 0
            }
            result.push({
                op : `LDA A: = ${loadData}`,
                A : A,
                T : T,
                ABinary : ABinary,
                TBinary : TBinary,
                Z : Z,
                C : C,
                pc : pcBinary
            })
        }else{
            let error = `SIMULAT ERROR :\nthere is no data in memory at ${src}`
            await showError2(error)
        }
    }else if(op === '1111'){
        await storeInMemory(src,ABinary);
        result.push({
            op : `STA Insert ${A} at ${src}`,
            A : A,
            T : T,
            ABinary : ABinary,
            TBinary : TBinary,
            Z : Z,
            C : C,
            pc : pcBinary
        })
    }
    pc += 1
    pcBinary = await convertTo12BitBinary(pc)
}

const simulate = async (file) => {
    machinString = []
    data = []
    memory = [] 
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload =async function(event) {

            var fileContents = event.target.result;
            let lines = fileContents.split('\n');
            await readFile(lines)
            
            let startAddress = await getStartAddress()
            
            if(startAddress){
                let startAddressInt = await convertBinaryToDecimal(startAddress)
                startAddressInt ++;
                startAddress = await convertTo12BitBinary(startAddressInt)
                let finishAdress = await getFinishAddress()
                if(finishAdress){
                    finishAdressInt = await convertBinaryToDecimal(finishAdress)
                    finishAdressInt --;
                    finishAdress = await convertTo12BitBinary(finishAdress)
                    pcBinary = startAddress
                    pc = await convertBinaryToDecimal(pcBinary)
                    instructure = await readFromMemory(startAddress)
                    if(instructure === false){
                        let error = `SIMULAT ERROR :\nthere is no data in memory at ${startAddress}`
                        await showError2(error)
                    }
                    let index = 0;
                    while(true){
                        if(index === 1000000000){
                            await showError2(`core dump`);       
                        }
                        index++;
                        await handleINS(instructure.substring(0,4),instructure.substring(4));
                        if(pcBinary === finishAdress){
                            break
                        }
                        instructure = await readFromMemory(pcBinary)
                        if(instructure === false){
                            let error = `SIMULAT ERROR :\nthere is no data in memory at ${pc}`
                            await showError2(error)
                        }
                    }
                }else{
                    let error = `SIMULAT ERROR :\nthere is no FINISH in your program`
                    await showError2(error)
                }
            }else{
                let error = `SIMULAT ERROR :\nthere is no START in your program`
                await showError2(error)
            }
            
            resolve(result);
        }
        reader.onerror = function (event) {
            reject(event.target.error);
        };
    
        reader.readAsText(file);
    })
}