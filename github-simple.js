function updateGithub(fileName, content) {
    return fetch(pass.url + "/" + fileName, {
        headers: { Authorization: "Bearer " + pass.token }
    }).then(r => r.json()).then(data =>
        fetch(pass.url + "/" + fileName, {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + pass.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Update " + fileName,
                content: btoa(unescape(encodeURIComponent(content))),
                sha: data.sha
            })
        }).then(r => r.json())
    );
}

function github(fileName) {
    return fetch(pass.url + "/" + fileName, {
        headers: { Authorization: "Bearer " + pass.token }
    }).then(r => r.json()).then(data =>
        new TextDecoder().decode(
            Uint8Array.from(atob(data.content), c => c.charCodeAt(0))
        )
    );
}

function intGitHub(data, file) {
    github(file).then(d => {
        const p = typeof data === "string" ? data : JSON.stringify(data, null, 2);

        if (d !== p) {
            updateGithub(file, p).then(a => {
             console.log(a.commit.message + " تم تحديث ملف GitHub \n" + file);
            });
        } else {
        console.log("المحتوى مطابق \n" + file);
    }
    });
}
