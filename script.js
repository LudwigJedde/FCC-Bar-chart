/*************/
/*** GRAPH ***/
/*************/
let width = 800,
    height = 400,
    barWidth = width / 275; /* répartition barre */

/* Conteneur du graph */
let svgContainer = d3.select('.graphHold').
append('svg').
attr('width', width + 100).
attr('height', height + 60);

/* Affichage lors du hover sur le graph */
/* fenêtre */
let tooltip = d3.select('.graphHold').
append("div").
attr("id", "tooltip").
style("opacity", 0);
/* ligne référence sur le graph */
let overlay = d3.select('.graphHold').
append('div').
attr('class', 'overlay').
style('opacity', 0);

/*************/
/*** DATA ****/
/*************/
d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', (err, data) => {

/* titre axe ordonnées et positionnement */
svgContainer.append('text').
attr('transform', 'rotate(-90)').
attr('x', -200).
attr('y', 80).
text('Produit Intérieur Brut');

svgContainer.append('number').
style('fill', 'white');
/* information bas de page et positionnement */
svgContainer.append('text').
attr('x', width / 2 + 30).
attr('y', height + 50).
text("Plus d'information : http://www.bea.gov/national/pdf/nipaguid.pdf").
attr('class', 'info');

/* découpage du temps en axe X */
let years = data.data.map((item) => {
  let trimestre;
  let mois = item[0].substring(5, 7);

  if (mois === '01') {
    trimestre = 'Trim 1';
  } else
  if (mois === '04') {
    trimestre = 'Trim 2';
  } else
  if (mois === '07') {
    trimestre = 'Trim 3';
  } else
  if (mois === '10') {
    trimestre = 'Trim 4';
  }

    return item[0].substring(0, 4) + ' ' + trimestre;
  });

  let yearsDate = data.data.map((item) => {
    return new Date(item[0]);
  });

  /* AXE X */
  let xMax = new Date(d3.max(yearsDate));
  xMax.setMonth(xMax.getMonth() + 3);
  let xScale = d3.scaleTime().
  domain([d3.min(yearsDate), xMax]).
  range([0, width]);

  let xAxis = d3.axisBottom().
  scale(xScale);

  let xAxisGroup = svgContainer.append('g').
  call(xAxis).
  attr('id', 'x-axis').
  attr('transform', 'translate(60, 400)');

  let GDP = data.data.map((item) => {
    return item[1];
  });

  let scaledGDP = [];

  let GDPMin = d3.min(GDP);
  let GDPMax = d3.max(GDP);

  let linearScale = d3.scaleLinear().
  domain([0, GDPMax]).
  range([0, height]);

  scaledGDP = GDP.map((item) => {
    return linearScale(item);
  });

  let yAxisScale = d3.scaleLinear().
  domain([0, GDPMax]).
  range([height, 0]);

  let yAxis = d3.axisLeft(yAxisScale);
  /* positionnement de l'axe ordonnée */
  let yAxisGroup = svgContainer.append('g').
  call(yAxis).
  attr('id', 'y-axis').
  attr('transform', 'translate(60, 0)');

  /* affichage et comportement du graph */
  d3.select('svg').selectAll('rect').
  data(scaledGDP).
  enter().
  append('rect').
  attr('data-date', (d, i) => {
    return data.data[i][0];
  }).
  attr('data-gdp', (d, i) => {
    return data.data[i][1];
  }).
  attr('class', 'bar').
  attr('x', (d, i) => {
    return xScale(yearsDate[i]);
  }).
  attr('y', (d, i) => {
    return height - d;
  }).
  attr('width', barWidth).
  attr('height', (d) => {
    return d;
  }).
  style('fill', 'yellowgreen').
  attr('transform', 'translate(60, 0)').
  on('mouseover', (d, i) => {
    overlay.transition().
    duration(0).
    style('height', d + 'px').
    style('width', barWidth + 'px').
    style('opacity', .9).
    style('left', i * barWidth + 0 + 'px').
    style('top', height - d + 'px').
    style('transform', 'translateX(60px)');
    tooltip.transition().
    duration(200).
    style('opacity', .9);
    tooltip.html(years[i] + '<br>' + GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1 ') + ' Milliards de' + ' $').
    attr('data-date', data.data[i][0]).
    style('left', i * barWidth + 30 + 'px').
    style('top', height - 100 + 'px').
    style('transform', 'translateX(60px)');
  }).
  on('mouseout', (d) => {
    tooltip.transition().
    duration(200).
    style('opacity', 0);
    overlay.transition().
    duration(200).
    style('opacity', 0);
  });

});