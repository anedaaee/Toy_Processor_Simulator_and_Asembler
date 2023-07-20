
const handleUploadFile = async () => {
    let fileInput = document.getElementById('inputCode');
    let file = fileInput.files[0];
    try{
        const value = await assemble(file)
        
        let machiCodeTable = ``;
        for (const machinCode of value.machinString){
            machiCodeTable += `  <tr>
                                    <td>${machinCode.address}</td>
                                    <td>${machinCode.code}</td>
                                    <td>${machinCode.Comment}</td>
                                </tr>`
        }
        let varableString = ``;
        for (const data of value.data){
            varableString += `  <tr>
                                    <td>${data.address}</td>
                                    <td>${data.name}</td>
                                </tr>`
        }
        let memoryString = ``;
        for (const mem of value.memory) {
            memoryString += `  <tr>
                                    <td>${mem.address}</td>
                                    <td>${mem.value}</td>
                                </tr>`
        }

        let htmlString = `<p style="margin:10px;">Machin Code</p>
                          <table>
                            <tr>
                                <th>Address</th>
                                <th>Code</th>
                                <th>Comment</th>
                            </tr>
                            ${machiCodeTable}
                          </table> 
                          <p style="margin:10px;">Variabel data</p>
                          <table>
                            <tr>
                                <th>address</th>
                                <th>name</th>
                            </tr>
                            ${varableString}
                          </table> 
                          <p style="margin:10px;">memory data</p>
                          <table>
                            <tr>
                                <th>address</th>
                                <th>value</th>
                            </tr>
                            ${memoryString}
                          </table> `

        let fileString = ``;
        fileString += `Machin Code:\n`
        for (const machinCode of value.machinString){
            fileString += `${machinCode.address} ${machinCode.code} ${machinCode.Comment}\n`
        }
        fileString += `Variable Date:\n`
        for (const data of value.data){
            fileString += `${data.address} ${data.name}\n`
        }
        fileString += `memory Date:\n`
        for (const mem of value.memory){
            fileString += `${mem.address} ${mem.value}\n`
        }
        
        const dataUrl = 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileString);

        htmlString += `<a id="download">Download result</a>`
        const tableDiv = document.getElementById('table')
        tableDiv.innerHTML = htmlString;
        const anchor = document.getElementById('download');
        anchor.href = dataUrl
        anchor.download = './code.txt';

    }catch(err){
        let htmlString = `<p style="margin:10px;color:red;">${err}</p>`
        const tableDiv = document.getElementById('table')
        tableDiv.innerHTML = htmlString;
    }
        
}