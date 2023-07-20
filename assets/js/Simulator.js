

const handleUploadFileSimulator = async () => {
    let fileInput = document.getElementById('inputCodeSimulate');
    let file = fileInput.files[0];
    try{
        const value = await simulate(file)
        let htmlString = `<h3 style="margin:10px;color:black;">Result:</h3>`
        let table = ``
        let i = 1;
        for(const result of value){
            table += `<tr>
                        <td>${i}</td>
                        <td>${result.A}</td>
                        <td>${result.T}</td>
                        <td>${result.ABinary}</td>
                        <td>${result.TBinary}</td>
                        <td>${result.Z}</td>
                        <td>${result.C}</td>
                        <td>${result.pc}</td>
                        <td>${result.op}</td>
                    </tr>`
            i+=1
        }
        htmlString += `
                        <table>
                            <tr>
                                <th>round</th>
                                <th>A</th>
                                <th>T</th>
                                <th>ABinary</th>
                                <th>TBinary</th>
                                <th>Z</th>
                                <th>C</th>
                                <th>pc</th>
                                <th>op</th>
                            </tr>
                            ${table}
                        </table> `
        const tableDiv = document.getElementById('result')
        tableDiv.innerHTML = htmlString;

    }catch(err){
        return err;
    }
}