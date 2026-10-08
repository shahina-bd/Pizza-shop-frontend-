const fs = require('fs');
const transcriptPath = 'C:\\Users\\TC\\.gemini\\antigravity\\brain\\01c53b00-c749-4734-b242-2aa2f63a2f31\\.system_generated\\logs\\transcript.jsonl';

const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');

lines.forEach((line, idx) => {
    if (!line.trim()) return;
    try {
        const step = JSON.parse(line);
        if (step.tool_calls) {
            step.tool_calls.forEach(tool => {
                if (tool.args && tool.args.TargetFile) {
                    const file = tool.args.TargetFile;
                    if (file.includes('HomeView.vue') || file.includes('CustomerMaster.vue')) {
                        const lineStr = JSON.stringify(tool);
                        const isTruncated = lineStr.includes('truncated') || lineStr.includes('Truncated');
                        console.log(`Step ${step.step_index}: ${tool.name} on ${file}. Truncated? ${isTruncated}`);
                    }
                }
            });
        }
    } catch (e) {
        // Line might be invalid JSON due to truncation
        const stepMatch = line.match(/"step_index":(\d+)/);
        const stepIdx = stepMatch ? stepMatch[1] : 'unknown';
        const fileMatch = line.match(/HomeView\.vue|CustomerMaster\.vue/i);
        const file = fileMatch ? fileMatch[0] : 'unknown';
        console.log(`Step ${stepIdx} failed to parse JSON. File: ${file}. Contains 'truncated'? ${line.includes('truncated')}`);
    }
});
