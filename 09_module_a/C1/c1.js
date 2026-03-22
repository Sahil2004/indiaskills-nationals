const inpt = document.querySelector("#folder")
const a = document.createElement("a")
const encoder = new TextEncoder()

inpt.addEventListener("change", async (e) => {
    if (inpt.files.length === 1) {
        const stream = new ReadableStream({
            async start(controller) {
                for (const file of inpt.files) {
                    const path = file.webkitRelativePath;
                    const header = encoder.encode(`FILE:${path}|SIZE:${file.size}\n`)
                    controller.enqueue(header)
                    const reader = file.stream().getReader()
                    while (true) {
                        const { done, value } = await reader.read()
                        if (done) break;
                        controller.enqueue(value)
                    }
                }
                controller.close()
            }
        })
        const compressedStream = stream.pipeThrough(new CompressionStream("gzip"))
        const response = new Response(compressedStream)
        const blob = await response.blob()
        a.href = URL.createObjectURL(blob)
        a.download = inpt.files[0].webkitRelativePath.split("/")[0] + ".gz"
        a.click()
    }
})