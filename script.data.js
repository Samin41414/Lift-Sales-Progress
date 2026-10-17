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

            // EmailJS send function using service_xq47tsa
            emailjs.send("service_xq47tsa", "YOUR_TEMPLATE_ID", templateParams)
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
            else if (proj.status.includes('Quotation')) badgeColor = "bg-sky-500/10 text-sky-400 border-sky-500/20";
            else if (proj.status.includes('Awaiting')) badgeColor = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
            else if (proj.status.includes('Confirmed')) badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            else if (proj.status.includes('Delivery')) badgeColor = "bg-purple-500/10 text-purple-400 border-purple-500/20";

            const row = document.createElement('tr');
            row.className = "hover:bg-slate-700/30 transition duration-150";
            row.innerHTML = `
                <td class="py-3.5 px-4 font-mono text-slate-400">${index + 1}</td>
                <td class="py-3.5 px-4 font-semibold text-white">${proj.salesperson}</td>
                <td class="py-3.5 px-4">
                    <div class="font-semibold text-slate-200">${proj.customerName}</div>
                    <div class="text-[11px] text-slate-400">${proj.projectName}</div>
                </td>
                <td class="py-3.5 px-4 text-slate-300">${proj.contactPerson}</td>
                <td class="py-3.5 px-4 text-center font-bold text-indigo-400">${proj.liftQty}</td>
                <td class="py-3.5 px-4 text-slate-300">${proj.liftDetails}</td>
                <td class="py-3.5 px-4">
                    <span class="inline-block px-2.5 py-1 text-[11px] font-medium rounded-md border ${badgeColor}">
                        ${proj.status}
                    </span>
                </td>
                <td class="py-3.5 px-4 text-slate-400 font-mono text-[11px]">${proj.targetDate}</td>
                <td class="py-3.5 px-4 text-right">
                    <button onclick="deleteProject(${proj.id})" class="text-rose-400 hover:text-rose-300 transition text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 rounded">
                        Delete
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    document.getElementById('totalProjects').innerText = projects.length;
    document.getElementById('totalLifts').innerText = totalDemand;
    document.getElementById('confirmedLifts').innerText = confirmedCount;
    document.getElementById('ordersReceived').innerText = ordersCount;
}

function deleteProject(id) {
    if(confirm("Are you sure you want to delete this project record?")) {
        let projects = JSON.parse(localStorage.getItem('liftProjects')) || [];
        projects = projects.filter(proj => proj.id !== id);
        localStorage.setItem('liftProjects', JSON.stringify(projects));
        loadProjects();
    }
}
