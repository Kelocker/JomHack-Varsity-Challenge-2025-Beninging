import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import impactData from '../data/impactData.json';

const Impact = ({ lang }) => {
  const [fullData, setFullData] = useState([]);
  const [series, setSeries] = useState([
    { name: lang.foodSaved, data: [] },
    { name: lang.foodWaste, data: [] }
  ]);
  const [options, setOptions] = useState({
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    xaxis: {
      type: 'datetime',
      categories: []
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '14px',
        fontFamily: 'Comic Sans MS, cursive, sans-serif'
      },
      x: {
        format: 'dd MMM yyyy'
      }
    },
    colors: ['#00C851', '#ff4444'],
    legend: {
      position: 'top',
      horizontalAlign: 'center'
    }
  });
  const [activeRange, setActiveRange] = useState('1M');
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const today = new Date();
    const filtered = impactData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate <= today;
    });
    setFullData(filtered);

    handleRangeChange('1M', filtered);
  }, []);

  const updateChart = (dataSubset) => {
    const savedSeries = dataSubset.map(item => item.saved);
    const wasteSeries = dataSubset.map(item => item.waste);
    const categories = dataSubset.map(item => item.date);

    setSeries([
      { name: lang.foodSaved, data: savedSeries },
      { name: lang.foodWaste, data: wasteSeries }
    ]);

    setOptions(prev => ({
      ...prev,
      xaxis: {
        ...prev.xaxis,
        categories: categories
      }
    }));
  };

  const handleRangeChange = (range, customData = null) => {
    setFade(false);

    setTimeout(() => {
      const today = new Date();
      let monthsBack = 0;

      switch (range) {
        case '1M':
          monthsBack = 0;
          break;
        case '3M':
          monthsBack = 2;
          break;
        case '6M':
          monthsBack = 5;
          break;
        case '1Y':
          monthsBack = 11;
          break;
        case 'ALL':
        default:
          updateChart(fullData);
          setActiveRange(range);
          setFade(true);
          return;
      }

      const baseData = customData || fullData;

      const filteredSubset = baseData.filter(item => {
        const itemDate = new Date(item.date);
        const itemYear = itemDate.getFullYear();
        const itemMonth = itemDate.getMonth();

        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();

        const totalMonthsDiff = (todayYear - itemYear) * 12 + (todayMonth - itemMonth);
        
        return totalMonthsDiff <= monthsBack;
      });

      updateChart(filteredSubset);
      setActiveRange(range);
      setFade(true);
    }, 300);
  };

  return (
    <div style={{ padding: '1rem', flex: 1 }}>
      <h2 style={{ textAlign: 'center', color: '#ff6f61', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        {lang.yourImpact}
      </h2>

      {/* Range Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
      {['1M', '3M', '6M', '1Y', 'ALL'].map(key => (
        <button
          key={key}
          onClick={() => handleRangeChange(key)}
          style={{
            padding: '0.4rem 0.8rem',
            backgroundColor: activeRange === key ? '#ff6f61' : '#ffffff',
            border: '1px solid #ff6f61',
            borderRadius: '20px',
            color: activeRange === key ? 'white' : '#ff6f61',
            fontWeight: activeRange === key ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease'
          }}
        >
          {lang.rangeLabels[key]}
        </button>
      ))}
      </div>

      {/* Chart or No Data Message */}
      <div style={{
        opacity: fade ? 1 : 0,
        transition: 'opacity 0.5s ease'
      }}>
        {series[0].data.length === 0 ? (
          <div style={{
            textAlign: 'center',
            marginTop: '2rem',
            color: '#999',
            fontSize: '1.1rem'
          }}>
            📭 {lang.noData}
          </div>
        ) : (
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={300}
          />
        )}
      </div>

      {/* Blinking animation keyframes */}
      <style>
        {`
          @keyframes blinker {
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

export default Impact;
