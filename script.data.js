document.addEventListener('DOMContentLoaded', () => {
    loadProjects();

    const form = document.getElementById('projectForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newProject = {
            id: Date.now(),
            salesperson: document.getElementById('salesperson').value,
            customerName: document.getElementById('customerName').value,
            projectName: document.getElementById('projectName').value,
            contactPerson: document.getElementById('contactPerson').value,
            liftQty: parseInt(document.getElementById('liftQty').value) || 0,
            liftDetails: document.getElementById('liftDetails').value,
            status: document.getElementById('status').value,
            targetDate: document.getElementById('targetDate').value
        };

        let projects = JSON.parse(localStorage.getItem('liftProjects')) || [];
        projects.push(newProject);
        localStorage.setItem('liftProjects', JSON.stringify(projects));

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

    projects.forEach((proj, index) => {
        totalDemand += proj.liftQty;
        if(proj.status.includes('Confirmed')) confirmedCount += proj.liftQty;
        if(proj.status.includes('Order')) ordersCount += proj.liftQty;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-3 py-2">${index + 1}</td>
            <td class="px-3 py-2 font-medium text-gray-900">${proj.salesperson}</td>
            <td class="px-3 py-2">
                <div class="font-bold">${proj.customerName}</div>
                <div class="text-xs text-gray-500">${proj.projectName}</div>
            </td>
            <td class="px-3 py-2 text-xs">${proj.contactPerson}</td>
            <td class="px-3 py-2 font-semibold text-center">${proj.liftQty}</td>
            <td class="px-3 py-2 text-xs">${proj.liftDetails}</td>
            <td class="px-3 py-2">
                <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">${proj.status}</span>
            </td>
            <td class="px-3 py-2 text-xs">${proj.targetDate}</td>
            <td class="px-3 py-2">
                <button onclick="deleteProject(${proj.id})" class="text-red-600 hover:text-red-900 text-xs font-semibold">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Update Summary Cards
    document.getElementById('totalProjects').innerText = projects.length;
    document.getElementById('totalLifts').innerText = totalDemand;
    document.getElementById('confirmedLifts').innerText = confirmedCount;
    document.getElementById('ordersReceived').innerText = ordersCount;
}

function deleteProject(id) {
    let projects = JSON.parse(localStorage.getItem('liftProjects')) || [];
    projects = projects.filter(proj => proj.id !== id);
    localStorage.setItem('liftProjects', JSON.stringify(projects));
    loadProjects();
}