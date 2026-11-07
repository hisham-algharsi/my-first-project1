async function getGithubText(fileName) {
    const res = await fetch(pass.url + "/" + fileName, {
        headers: { Authorization: "Bearer " + pass.token }
    });
    const data = await res.json();
    return new TextDecoder().decode(
        Uint8Array.from(atob(data.content), c => c.charCodeAt(0))
    );
}

async function getGithubJson(fileName) {
    return JSON.parse(await getGithubText(fileName));
}

async function updateGithub(fileName, content) {
    const res = await fetch(pass.url + "/" + fileName, {
        headers: { Authorization: "Bearer " + pass.token }
    });
    const data = await res.json();

    const putRes = await fetch(pass.url + "/" + fileName, {
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
    });
     if (!putRes.ok) throw new Error((await putRes.json()).message);
    return await putRes.json();
}

async function createGithub(fileName, content) {
    const res = await fetch(pass.url + "/" + fileName, {
        method: "PUT",
        headers: {
            Authorization: "Bearer " + pass.token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Create " + fileName,
            content: btoa(unescape(encodeURIComponent(content)))
        })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
}

async function deleteGithub(fileName) {
    const res = await fetch(pass.url + "/" + fileName, {
        headers: { Authorization: "Bearer " + pass.token }
    });

    const data = await res.json();

    const delRes = await fetch(pass.url + "/" + fileName, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + pass.token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Delete " + fileName,
            sha: data.sha
        })
    });

    const result = await delRes.json();
    if (!delRes.ok) throw new Error(result.message);
    return result;
}
async function intGitHub(data, fileName) {
    const response = await getGithubText(fileName);
    const string = typeof data === "string" ? data : JSON.stringify(data, null, 2);

    if (string !== response) {
        const result = await updateGithub(fileName, string);
        console.log(result.commit.message);
         alert(result.commit.message);
    } else {
        //console.log("المحتوى مطابق " + fileName);
    }
      }
