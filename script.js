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

        // EmailJS Notification Trigger
        if (status.includes('Confirmed') || status.includes('Order') || status.includes('Delivery')) {
            const templateParams = {
                customer_name: customerName,
                customer_phone: customerPhone,
                lift_capacity: liftCapacity
            };

            emailjs.send("service_xq47tsa", "template_md4vla7", templateParams)
                .then(function(response) {
                    alert("Project added successfully & Email notifications sent!");
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
            if (proj.status.includes('Confirmed') || proj.status.includes('Order')) {
                confirmedCount += proj.liftQty;
                ordersCount += proj.liftQty;
            }

            // Status Badge Formatting
            let badgeColor = "bg-slate-700/50 text-slate-300 border-slate-600";
            if (proj.status.includes('Initial')) {
                badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
            } else if (proj.status.includes('Quotation')) {
                badgeColor = "bg-sky-500/10 text-sky-400 border-sky-500/20";
            } else if (proj.status.includes('Awaiting')) {
                badgeColor = "bg-purple-500/10 text-purple-400 border-purple-500/20";
            } else if (proj.status.includes('Confirmed') || proj.status.includes('Order') || proj.status.includes('Delivery')) {
                badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            }

            const row = document.createElement('tr');
            row.className = "hover:bg-slate-800/40 transition duration-150";
            row.innerHTML = `
                <td class="py-3.5 px-4 font-medium text-slate-400">${index + 1}</td>
                <td class="py-3.5 px-4 font-semibold text-slate-200">${escapeHtml(proj.salesperson)}</td>
                <td class="py-3.5 px-4">
                    <div class="font-medium text-white">${escapeHtml(proj.customerName)}</div>
                    <div class="text-[11px] text-slate-400">${escapeHtml(proj.projectName)}</div>
                </td>
                <td class="py-3.5 px-4 text-slate-300">${escapeHtml(proj.contactPerson)}</td>
                <td class="py-3.5 px-4 text-center font-bold text-white">${proj.liftQty}</td>
                <td class="py-3.5 px-4 text-slate-300">${escapeHtml(proj.liftDetails)}</td>
                <td class="py-3.5 px-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${badgeColor}">
                        ${escapeHtml(proj.status)}
                    </span>
                </td>
                <td class="py-3.5 px-4 text-slate-400">${proj.targetDate}</td>
                <td class="py-3.5 px-4 text-right">
                    <button onclick="deleteProject(${proj.id})" class="text-rose-400 hover:text-rose-300 font-medium hover:underline text-[11px]">
                        Delete
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Update KPI Cards
    document.getElementById('totalProjects').textContent = projects.length;
    document.getElementById('totalLifts').textContent = totalDemand;
    document.getElementById('confirmedLifts').textContent = confirmedCount;
    document.getElementById('ordersReceived').textContent = ordersCount;
}

// Delete Functionality
function deleteProject(id) {
    if (confirm("Are you sure you want to delete this project?")) {
        let projects = JSON.parse(localStorage.getItem('liftProjects')) || [];
        projects = projects.filter(p => p.id !== id);
        localStorage.setItem('liftProjects', JSON.stringify(projects));
        loadProjects();
    }
}

// Helper Function for XSS Protection
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}
