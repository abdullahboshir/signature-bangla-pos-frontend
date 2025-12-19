
const axios = require('axios');
async function run() {
    try {
        const targetL1 = "693d966aad16f44eb4082598";
        console.log("Looking for subcats of:", targetL1);

        const res = await axios.get('http://localhost:5000/api/v1/super-admin/categories/sub?limit=1000');
        const list = res.data.data?.result || res.data.data || [];

        console.log("Total subcats fetched:", list.length);

        const children = list.filter(c => {
            const p = c.category;
            const pid = (typeof p === 'object' && p) ? (p._id || p.id) : p;
            return String(pid) === targetL1;
        });

        console.log(`Found ${children.length} subcats for this L1.`);
        if (children.length > 0) {
            console.log("Sample Child:", JSON.stringify(children[0], null, 2));
        }
    } catch (e) {
        console.error(e.message);
    }
}
run();
