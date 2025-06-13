document.addEventListener('DOMContentLoaded', function() {
  // Debounce function for resize events
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }

  // Responsive table handling with debounce
  const makeTablesResponsive = debounce(function() {
    const tables = document.querySelectorAll('table');
    const screenWidth = window.innerWidth;

    tables.forEach(table => {
      if (screenWidth <= 768) {
        // Convert to card layout on mobile
        if (!table.classList.contains('mobile-converted')) {
          convertTableToCards(table);
          table.classList.add('mobile-converted');
        }
      } else {
        // Revert to table layout on larger screens
        if (table.classList.contains('mobile-converted')) {
          revertCardsToTable(table);
          table.classList.remove('mobile-converted');
        }
      }
    });
  }, 100);

  // Enhanced table to cards conversion
  function convertTableToCards(table) {
    try {
      const headers = [];
      const thead = table.querySelector('thead');
      const tbody = table.querySelector('tbody');
      const container = document.createElement('div');
      container.className = 'table-cards-container';
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Table content displayed as cards');

      // Get headers
      if (thead) {
        const headerCells = thead.querySelectorAll('th');
        headerCells.forEach(cell => {
          headers.push(cell.textContent.trim());
        });
      }

      // Create cards for each row
      const rows = tbody.querySelectorAll('tr');
      rows.forEach((row, rowIndex) => {
        const card = document.createElement('div');
        card.className = 'table-card';
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Item ${rowIndex + 1}`);
        
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, index) => {
          if (headers[index]) { // Only create items for columns with headers
            const cardItem = document.createElement('div');
            cardItem.className = 'card-item';
            
            const label = document.createElement('span');
            label.className = 'card-label';
            label.textContent = headers[index] + ': ';
            label.setAttribute('aria-hidden', 'true');
            
            const value = document.createElement('span');
            value.className = 'card-value';
            value.textContent = cell.textContent.trim();
            value.setAttribute('aria-label', `${headers[index]}: ${cell.textContent.trim()}`);
            
            cardItem.appendChild(label);
            cardItem.appendChild(value);
            card.appendChild(cardItem);
          }
        });
        
        container.appendChild(card);
      });

      // Replace table with cards
      table.insertAdjacentElement('beforebegin', container);
      table.style.display = 'none';
    } catch (error) {
      console.error('Error converting table to cards:', error);
    }
  }

  // Revert cards back to table with cleanup
  function revertCardsToTable(table) {
    try {
      const container = table.previousElementSibling;
      if (container && container.classList.contains('table-cards-container')) {
        container.remove();
        table.style.display = '';
      }
    } catch (error) {
      console.error('Error reverting cards to table:', error);
    }
  }

  // Enhanced sortable tables with touch support
  function makeTablesSortable() {
    const tables = document.querySelectorAll('table:not(.mobile-converted) thead');

    tables.forEach(thead => {
      const headers = thead.querySelectorAll('th');
      
      headers.forEach((header, index) => {
        if (header.textContent.trim() !== '') {
          header.style.cursor = 'pointer';
          header.setAttribute('tabindex', '0');
          header.setAttribute('role', 'button');
          header.setAttribute('aria-label', `Sort by ${header.textContent}`);
          
          // Click/touch event handler
          const handleSort = () => sortTable(thead.parentNode, index);
          
          header.addEventListener('click', handleSort);
          header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSort();
            }
          });
        }
      });
    });
  }

  // Enhanced table sorting with ARIA
  function sortTable(table, columnIndex) {
    try {
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const header = table.querySelector(`th:nth-child(${columnIndex + 1})`);
      const isAscending = !table.classList.contains('sorted-asc');
      
      // Remove previous sort indicators
      table.querySelectorAll('th').forEach(h => {
        h.removeAttribute('aria-sort');
      });
      
      // Set new sort direction
      header.setAttribute('aria-sort', isAscending ? 'ascending' : 'descending');
      
      rows.sort((a, b) => {
        const aText = a.querySelectorAll('td')[columnIndex].textContent.trim();
        const bText = b.querySelectorAll('td')[columnIndex].textContent.trim();
        
        if (isValidDate(aText)) {
          return isAscending 
            ? new Date(aText) - new Date(bText)
            : new Date(bText) - new Date(aText);
        }
        
        const aNum = parseFloat(aText.replace(/[^0-9.-]/g, ''));
        const bNum = parseFloat(bText.replace(/[^0-9.-]/g, ''));
        if (!isNaN(aNum)) {
          return isAscending ? aNum - bNum : bNum - aNum;
        }
        
        return isAscending 
          ? aText.localeCompare(bText)
          : bText.localeCompare(aText);
      });
      
      // Remove all existing rows
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }
      
      // Add sorted rows
      rows.forEach(row => {
        tbody.appendChild(row);
      });
      
      // Update sorting indicator
      table.classList.toggle('sorted-asc', isAscending);
      
    } catch (error) {
      console.error('Error sorting table:', error);
    }
  }

  // Enhanced filter functionality
  function addTableFilters() {
    const reportSection = document.querySelector('.report-section');
    if (!reportSection) return;
    
    try {
      const filterContainer = document.createElement('div');
      filterContainer.className = 'table-filter-container';
      filterContainer.innerHTML = `
        <label for="table-filter" class="sr-only">Filter reports</label>
        <input type="text" id="table-filter" placeholder="Filter reports..." 
               class="filter-input" aria-label="Filter reports">
        <button id="clear-filter" class="filter-clear-btn" aria-label="Clear filter">Clear</button>
      `;
      
      reportSection.insertBefore(filterContainer, reportSection.firstChild);
      
      const filterInput = document.getElementById('table-filter');
      const clearButton = document.getElementById('clear-filter');
      
      // Debounced filter function
      const applyFilter = debounce(function() {
        const filterValue = this.value.toLowerCase();
        const tables = document.querySelectorAll('table');
        let anyMatches = false;
        
        tables.forEach(table => {
          const rows = table.querySelectorAll('tbody tr');
          let hasMatches = false;
          
          rows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            if (rowText.includes(filterValue)) {
              row.style.display = '';
              hasMatches = true;
              anyMatches = true;
            } else {
              row.style.display = 'none';
            }
          });
          
          // Show/hide table based on matches
          table.style.display = hasMatches ? '' : 'none';
        });
        
        // Announce results to screen readers
        if (filterValue) {
          const message = anyMatches 
            ? `${document.querySelectorAll('table tbody tr:not([style*="display: none"])').length} matching items found`
            : 'No matching items found';
          liveAnnounce(message);
        }
      }, 300);
      
      filterInput.addEventListener('input', applyFilter);
      
      clearButton.addEventListener('click', function() {
        filterInput.value = '';
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
          table.style.display = '';
          const rows = table.querySelectorAll('tbody tr');
          rows.forEach(row => {
            row.style.display = '';
          });
        });
        liveAnnounce('Filter cleared');
      });
      
      // Mobile touch enhancements
      if ('ontouchstart' in window) {
        filterInput.addEventListener('focus', function() {
          this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
    } catch (error) {
      console.error('Error setting up filters:', error);
    }
  }

  // Accessibility helper for live announcements
  function liveAnnounce(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => {
      announcement.remove();
    }, 1000);
  }

  // Initialize everything with error handling
  function init() {
    try {
      makeTablesResponsive();
      makeTablesSortable();
      addTableFilters();
      
      // Add responsive event listeners
      window.addEventListener('resize', makeTablesResponsive);
      
      // Handle orientation changes on mobile
      window.addEventListener('orientationchange', makeTablesResponsive);
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  // Run initialization
  init();
});