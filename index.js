const apiUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
const description = document.getElementsByClassName('description')[0];
const details = document.getElementsByClassName('details')[0];
const placeHolderText = 'USA Gross Domestic Product Data';

details.textContent = placeHolderText;

const plot = (data) => {

  // calculate widht and height of svg and width of each item
  const margin = { top: 20, right: 20, bottom: 10, left: 100 };
  const width = Math.max((((window.innerWidth / 100) * 80) - margin.right - margin.left), 500);
  const height = ((window.innerHeight / 100) * 80) - margin.bottom - margin.top;
  const itemWidth = Math.floor(width / data.length);

  // transform data
  const transformedData = data.map(d => {
    return {
      date: new Date(d[0]),
      value: d[1]
    };
  });

  const svg = d3.select('svg')
    .attr('width', width + margin.left + margin.right + 500)
    .attr('height', height + margin.top + margin.bottom + 100)
    .append('g')
    .attr('transform',
      `translate(${margin.left}, ${margin.top})`);

  // scale functions      
  const x = d3.scaleTime().range([0, width]).domain(d3.extent(transformedData, d => d.date));
  const y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(transformedData, d => d.value)]);

  // draw the axes

  // x axis and label
  svg.append('g')
    .attr('transform',
      `translate(0, ${height})`)
    .attr('class', 'axis')
    .call(d3.axisBottom(x));

  svg.append("text")
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .attr('class', 'label')
    .text("Year");

  // y axis and label  
  svg.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y));

  svg.append("text")
    .attr('class', 'label')
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("GDP USA");

  // plot the data  
  svg.selectAll('.item')
    .data(transformedData)
    .enter()
    .append('rect')
    .attr('x', d => x(d.date))
    .attr('y', d => y(d.value))
    .attr('height', d => height - y(d.value))
    .attr('width', itemWidth)
    .attr('class', 'item')
    .on("mouseover", (d) => {
      details.textContent = `$${d.value} ${d.date.toDateString()}`;
    })
    .on("mouseout", () => {
      details.textContent = placeHolderText;
    });
}

const getGDPData = () => {
  return fetch(apiUrl)
    .then(response => {
      return response.json();
    });
};

const fetchData = async () => {
  try {
    const response = await getGDPData();
    description.textContent = response.description;
    plot(response.data);
  } catch (e) {
    console.error(e);
  }
}

fetchData();