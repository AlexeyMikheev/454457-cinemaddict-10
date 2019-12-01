const createFiltersTemplate = (filters) => {
  let filtersTemplate = ``;

  filtersTemplate = filters.reduce((filtersMappedTemplate, filter)=>{
    const {title, anchor, count, isActive} = filter;
    const activeClass = isActive ? `main-navigation__item--active` : ``;

    filtersMappedTemplate += count !== null ? `  <a href="#${anchor}" class="main-navigation__item ${activeClass}">${title} <span class="main-navigation__item-count">${count}</span></a>` :
      `<a href="#${anchor}" class="main-navigation__item ${activeClass}">${title}</a>`;

    return filtersMappedTemplate;
  }, filtersTemplate);

  return filtersTemplate;
};

const createMenuTemplate = (filters) =>{
  const filtersMappedTemplate = createFiltersTemplate(filters);

  return `<nav class="main-navigation">${filtersMappedTemplate}<a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`;
};

export {createMenuTemplate};
