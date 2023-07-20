
const convertTo16BitBinary = async (number) => {
    let binaryString = number.toString(2);
    let paddedBinary = binaryString.padStart(16, '0');
    return paddedBinary;
}
const convertTo12BitBinary = async (number) => {
    let binaryString = number.toString(2);
    let paddedBinary = binaryString.padStart(12, '0');
    return paddedBinary;
}
let machinString = []
let data = [];

let memory = [];
let variable = [];
const showError = async (error) => {
    let htmlString = `<h3 style="margin:10px;color:red;">${error}</h3>`
    const tableDiv = document.getElementById('table')
    tableDiv.innerHTML = htmlString;
    throw new Error(error)
}

const handleDotDate = async (lineSplit,addressBinary,i) => {
    let flag = true;
    for (const d of data){
        if(lineSplit[1] == d.name){
            flag = false;
            break
        }
    }
    if(flag){
        if(lineSplit[2]){

            if( lineSplit[2] >= 0 && lineSplit[2] < 2 ** 16){
                data.push({
                    name : lineSplit[1],
                    address : addressBinary
                })
                memory.push({
                    address : addressBinary ,
                    value : lineSplit[2]?await convertTo16BitBinary(parseInt(lineSplit[2])):'0000000000000000',
                })
            }else{
                let error = (`COMPILE ERROR: \n\tVALUE MUST BE BETWEEN [0,2 ^ 16)\n\tLINE:${i+1}`)
                await showError(error)
            }
        }else{
            data.push({
                name : lineSplit[1],
                address : addressBinary
            })
            memory.push({
                address : addressBinary ,
                value : '0000000000000000',
            })
        }
    }else{
        showError(`COMPILE ERROR: \n\tNAME ${lineSplit[1]} ALREADY EXIST\n\tLINE:${i+1}`)
    }
}

const handleLable = async (lineSplit,addressBinary) => {
    data.push({
        name : lineSplit[0].substring(1),
        address : addressBinary
    })
    memory.push({
        address : addressBinary ,
        value : '0000'+addressBinary,
    })
}
const handleAKindInstructor = async (lineSplit,addressBinary,i) => {
    let srcValue;
    let flag1 = false,flag2 = false;
    let comment = ''
    for (const srcData of data){
        if(srcData.name === lineSplit[1]){
            srcValue = srcData.address;
            flag1 = true;
        }
    }
    let opCode;
    for (const op of opCodes){
        if(op.op === lineSplit[0]){
            opCode = op.opCode;
            comment = op.comment
            flag2 = true
        }
    }
    if (flag1 && flag2){
        machinString.push({
            address : addressBinary ,
            code : opCode + srcValue ,
            Comment : comment.replace('@',srcValue) 
        })
        memory.push({
            address : addressBinary ,
            value : opCode + srcValue
        })
    }else{
        let error = (`COMPILE ERROR: \n\tTHERE IS ERROR IN -> ${lineSplit[1]}\n\tTHERE IS NO SUCH A VARIABLE\n\tLINE:${i+1}`)
        await showError(error)
    }
}
const handleBKindInstructor =  async (lineSplit,addressBinary,i) => {
    let opCode;
    let comment = '';
    let flag = false;
    for (const op of opCodes){
        if(op.op === lineSplit[0]){
            opCode = op.opCode;
            comment = op.comment
            flag = true
        }
    }
    if(flag){
        machinString.push({
            address : addressBinary ,
            code : opCode + '000000000000',
            Comment : comment
        })
        memory.push({
            address : addressBinary ,
            value : opCode+'000000000000'
        })
    }
}

const assemble = async (file) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload =async function(event) {
            
            var fileContents = event.target.result;
            var lines = fileContents.split('\n');
            let address = 0;
            for (let i = 0; i < lines.length - 1; i++) {
                let addressBinary = await convertTo12BitBinary(address);
                let lineSplit = lines[i].split(' ');
                if(lineSplit[0].charAt(0) === '.'){
                    if(lineSplit[0] === '.ORG'){
                        if(lineSplit[1]>= 0 && lineSplit[1] < 2 ** 12){
                            address = parseInt(lineSplit[1]);
                            address -= 1;
                            addressBinary = await convertTo12BitBinary(address);
                        }else{
                            let error = (`COMPILE ERROR: \n\tADRESS MUST BE BETWEEN [0,2 ^ 12)\n\tLINE:${i+1}`)
                            await showError(error)
                        }

                    }else{
                        if(lineSplit[0] !== '.ORG' && lineSplit[0] !== '.Data'){
                            await handleLable(lineSplit,addressBinary)
                        }
                    }
                }
                address ++;
            }
            address = 0
            for (let i = 0; i < lines.length - 1; i++) {
                
                let addressBinary = await convertTo12BitBinary(address);
                let lineSplit = lines[i].split(' ');
                

                if(lineSplit[0] === '.ORG'){
                    if(lineSplit[1]>= 0 && lineSplit[1] < 2 ** 12){
                        address = parseInt(lineSplit[1]);
                        address -= 1;
                        addressBinary = await convertTo12BitBinary(address);
                    }else{
                        let error = (`COMPILE ERROR: \n\tADRESS MUST BE BETWEEN [0,2 ^ 12)\n\tLINE:${i+1}`)
                        await showError(error)
                    }
                }else if(lineSplit[0] === '.Data'){
                    await handleDotDate(lineSplit,addressBinary,i)
                }else if(lineSplit[0].charAt(0) === '.'){
                    
                }else if(lineSplit[0] === 'START'){
                    data.push({
                        name : 'START',
                        address : addressBinary
                    })
                    memory.push({
                        address : addressBinary,
                        value : "0000" + addressBinary
                    })
                }else if(lineSplit[0] === 'FINISH'){
                    data.push({
                        name : 'FINISH',
                        address : addressBinary
                    })
                    memory.push({
                        address : addressBinary,
                        value : "0000" + addressBinary
                    })
                }else{
                    if(lineSplit[1]){
                        await handleAKindInstructor(lineSplit,addressBinary,i)
                    }else{
                        await handleBKindInstructor(lineSplit,addressBinary,i)
                    }
                }
                address += 1;
            }
            resolve({
                machinString: machinString,
                data: data,
                memory : memory
            });
        };
        reader.onerror = function (event) {
            reject(event.target.error);
        };
    
        reader.readAsText(file);
    });

}

opCodes = [
    {
        op : 'JMP',
        opCode : '0000' ,
        comment : 'PC:=@'
    },
    {
        op : 'ADC',
        opCode : '0001',
        comment : 'A=:A+[@]'
    },
    {
        op : 'XOR',
        opCode : '0010',
        comment : 'A:=A xor [@]' 
    },
    {
        op : 'SBC',
        opCode : '0011',
        comment : 'A:+A - [@] - C' 
    },
    {
        op : 'ROR',
        opCode : '0100',
        comment : 'A,C:=A,C ror 1' 
    },
    {
        op : 'TAT',
        opCode : '0101',
        comment : 'T:=A'
    },
    {
        op : 'OR',
        opCode : '0110',
        comment : 'A:=A or [@]' 
    },
    {
        op : 'ILLEGAL',
        opCode : '0111',
        comment : 'undefined' 
    },
    {
        op : 'AND',
        opCode : '1000',
        comment : 'A:= A and [@]' 
    },
    {
        op : 'LDC',
        opCode : '1001',
        comment : 'A:=[@];C:=0'
    },
    {
        op : 'BCC',
        opCode : '1010',
        comment : 'IF C=1 THEN PC:=[@]'
    },
    {
        op : 'BNE',
        opCode : '1011',
        comment : 'IF Z=0 THEN PC:=[@]'
    },
    {
        op : 'LDI',
        opCode : '1100',
        comment : 'A:=[A]'
    },
    {
        op : 'STT',
        opCode : '1101',
        comment : '[A]:=T'
    },
    {
        op : 'LDA',
        opCode : '1110',
        comment : 'A:=[@]' 
    },
    {
        op : 'STA',
        opCode : '1111',
        comment : '[@]:=A' 
    },
]
