
const axios = require('axios');
async function run() {
    try {
        const res = await axios.get('http://localhost:5000/api/v1/super-admin/products?limit=1');
        const product = res.data.data?.result?.[0] || res.data.data?.[0];
        if (product) {
            const businessUnit = (typeof product.businessUnit === 'object') ? (product.businessUnit._id || product.businessUnit.id) : product.businessUnit;
            console.log("PRODUCT_ID:", product._id || product.id);
            console.log("BUSINESS_UNIT:", businessUnit);
        } else {
            console.log("No products found.");
        }
    } catch (e) {
        console.error(e.message);
    }
}
run();
