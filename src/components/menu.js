const clearFilters = () =>{
  let filtersContainer = document.querySelector(`.main-navigation`);
  if (filtersContainer !== null) {
    filtersContainer.remove();
  }
};

const createFiltersTemplate = (filters) => {
  let filtersTemplate = ``;

  filtersTemplate = filters.reduce((filtersMappedTemplate, filter)=>{
    const {title, anchor, count, isActive, isAddition} = filter;
    const activeClass = isActive ? `main-navigation__item--active` : ``;
    const additionClass = isAddition ? `main-navigation__item--additional` : ``;

    filtersMappedTemplate += count !== null ? `<a href="#${anchor}" class="main-navigation__item ${activeClass} ${additionClass}">${title} <span class="main-navigation__item-count">${count}</span></a>` :
      `<a href="#${anchor}" class="main-navigation__item ${activeClass} ${additionClass}">${title}</a>`;

    return filtersMappedTemplate;
  }, filtersTemplate);

  return filtersTemplate;
};

const createMenuTemplate = (filters) =>{
  clearFilters();

  const filtersMappedTemplate = createFiltersTemplate(filters);
  return `<nav class="main-navigation">${filtersMappedTemplate}</nav>`;
};

export {createMenuTemplate};
