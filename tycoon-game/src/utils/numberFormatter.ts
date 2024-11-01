export const formatCash = (value: number): string => {
    if (value >= 1e12) {
        return Math.round(value / 1e10) / 100 + 'T';
    } else if (value >= 1e9) {
        return Math.round(value / 1e7) / 100 + 'B';
    } else if (value >= 1e6) {
        return Math.round(value / 1e4) / 100 + 'M';
    } else if (value >= 100000) {
        // Format numbers between 100,000 and 999,999 with a space between hundreds of thousands and thousands
        return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    } else {
        return Math.round(value).toString();
    }
};

export const formatAmount = (value: number): string => {
    if (value >= 1e12) {
        return Math.round(value / 1e10) / 100 + 'T';
    } else if (value >= 1e9) {
        return Math.round(value / 1e7) / 100 + 'B';
    } else if (value >= 1e6) {
        return Math.round(value / 1e4) / 100 + 'M';
    } else if (value >= 1e4) {
        // Format numbers between 10,000 and 999,999 with two decimal places and 'k'
        return (Math.round(value / 1e1) / 100).toFixed(2) + 'k';
    } else if (value >= 1000) {
        // Format numbers between 1,000 and 9,999 with one decimal place and 'k'
        return (Math.round(value / 1e0) / 1000).toFixed(1) + 'k';
    } else {
        return Math.round(value).toString();
    }
};
