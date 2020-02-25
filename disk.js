// Create DOM svg element to represent disks
const disk = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
disk.setAttribute('width', '60');
disk.setAttribute('height', '60');
disk.setAttribute('viewBox', '0 0 24 24');
disk.setAttribute('stroke-width', '2');

// Add a circle to the svg element
const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
circle.setAttribute('cx', '12');
circle.setAttribute('cy', '12');
circle.setAttribute('r', '9');

disk.appendChild(circle);

// Add CSS classes and event listeners to each type of disk
const darkDisk = disk.cloneNode(true);
darkDisk.className.baseVal = 'disk disk-dark';

const lightDisk = disk.cloneNode(true);
lightDisk.className.baseVal = 'disk disk-light';

let darkMove = disk.cloneNode(true);
darkMove.firstChild.setAttribute('onclick', 'selectMove()');
darkMove.className.baseVal = 'disk move-dark';

let lightMove = disk.cloneNode(true);
lightMove.firstChild.setAttribute('onclick', 'selectMove()');
lightMove.className.baseVal = 'disk move-light';