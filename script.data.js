document.addEventListener('DOMContentLoaded', () => {
    loadProjects();

    const form = document.getElementById('projectForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const customerName = document.getElementById('customerName').value;
        const customerPhone = document.getElementById('contactPerson').value;
        const liftCapacity = document.getElementById('liftDetails').value;
        const status = document.getElementById('status').value;

        const newProject = {
            id: Date.now(),
            salesperson: document.getElementById('salesperson').value,
            customerName: customerName,
            projectName: document.getElementById('projectName').value,
            contactPerson: customerPhone,
            liftQty: parseInt(document.getElementById('liftQty').value) || 0,
            liftDetails: liftCapacity,
            status: status,
            targetDate: document.getElementById('targetDate').value
        };

        let projects = JSON.parse(localStorage.getItem('liftProjects')) || [];
        projects.push(newProject);
        localStorage.setItem('liftProjects', JSON.stringify(projects));

        // EmailJS Notification Trigger if Confirmed or Order Placed or Delivery Planning
        if (status.includes('Confirmed') || status.includes('Order') || status.includes('Delivery')) {
            const templateParams = {
                customer_name: customerName,
                customer_phone: customerPhone,
                lift_capacity: liftCapacity
            };

            // EmailJS send function using service_xq47tsa and template_md4vla7
            emailjs.send("service_xq47tsa", "template_md4vla7", templateParams)
                .then(function(response) {
                    alert("Project added successfully & Email notifications sent to saminsalampranto@gmail.com, askinvestment18@gmail.com, mkdewan971@gmail.com!");
                }, function(error) {
                    alert("Project added, but email notification failed: " + JSON.stringify(error));
                });
        } else {
            alert("Project added successfully!");
        }

        form.reset();
        loadProjects();
    });
});

function loadProjects() {
    const tableBody = document.getElementById('salesTableBody');
    const projects = JSON.parse(localStorage.getItem('liftProjects')) || [];
    
    tableBody.innerHTML = '';
    
    let totalDemand = 0;
    let confirmedCount = 0;
    let ordersCount = 0;

    if (projects.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="py-8 text-center text-slate-500 font-medium">
                    No active project records found. Add a new opportunity above.
                </td>
            </tr>
        `;
    } else {
        projects.forEach((proj, index) => {
            totalDemand += proj.liftQty;
            if(proj.status.includes('Confirmed')) confirmedCount += proj.liftQty;
            if(proj.status.includes('Order')) ordersCount += proj.liftQty;

            let badgeColor = "bg-slate-700/50 text-slate-300 border-slate-600";
            if (proj.status.includes('Initial')) badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
            else if (proj.status.includes('Qu
