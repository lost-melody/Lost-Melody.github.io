<script lang="ts">
    import mappingsData from "$lib/assets/wafel/into_map.txt?raw";
    import charDivsData from "$lib/assets/wafel/into_div.txt?raw";
    import charFreqsData from "$lib/assets/practice/freq.txt?raw";

    /** 字根-編碼 映射表 */
    var mappings: Map<string, string> = parseMappings(mappingsData);
    /** 漢字-頻率 映射表 */
    var charFreqs: Map<string, number> = parseCharFreq(charFreqsData);
    /** 字根-頻率 映射表 */
    var compFreqs: Map<string, number> = parseCompFreq(charDivsData, charFreqs);

    function parseMappings(data: string): Map<string, string> {
        var mappings = new Map<string, string>();
        for (let line of data.split("\n")) {
            if (line && !line.startsWith("#")) {
                // ["Ka", "上"]
                let [code, comp] = line.split("\t");
                mappings.set(comp, code);
            }
        }
        return mappings;
    }
    function parseCharFreq(data: string): Map<string, number> {
        var freqs = new Map<string, number>();
        for (let line of data.split("\n")) {
            if (line && !line.startsWith("#")) {
                let [char, freqStr] = line.split("\t");
                let freq = Number.parseFloat(freqStr);
                freqs.set(char, freq);
            }
        }
        return freqs;
    }
    function parseCompFreq(data: string, charFreqs: Map<string, number>): Map<string, number> {
        var freqs = new Map<string, number>();
        for (let line of data.split("\n")) {
            if (line && !line.startsWith("#")) {
                let [char, div] = line.split("\t");
                let freq = charFreqs.get(char);
                if (!freq) {
                    continue;
                }
                let comps = div.split(" ");
                for (let comp of comps) {
                    freqs.set(comp, (freqs.get(comp) || 0) + freq);
                }
            }
        }
        return freqs;
    }
</script>
