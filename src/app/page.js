'use client';
import { useEffect, useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Define PDF styles
const styles = StyleSheet.create({
  page: { padding: 30, position: 'relative' },
  header: { fontSize: 30, textAlign: 'center', marginBottom: 20 },
  subHeader: { fontSize: 12, textAlign: 'left', marginBottom: 10 },
  section: { marginBottom: 20 },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#e4e4e4', fontSize: 12 },
  tableRow: { flexDirection: 'row' },
  tableCell: { flex: 1, textAlign: 'center', padding: 8, border: '1px solid #000' },
  totalRow: { flexDirection: 'row', marginTop: 20 },
  totalCell: { flex: 1, textAlign: 'left', padding: 8, fontWeight: 'bold' },
  terms: { fontSize: 10, marginTop: 10, textAlign: 'left' },
  contact: { fontSize: 10, marginTop: 10, textAlign: 'left' },
  chead: { fontWeight: 'bold', fontSize: 12, marginBottom: 10 },
  footer: { marginTop: 20, fontSize: 10, textAlign: 'center' },
  watermark: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    transform: 'translate(-50%, -50%)',
    opacity: 0.1,
    width: 500,
    height: 500,
    zIndex: -1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Date format function
const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
};

// PDF Document Component
const InvoicePDF = ({ clientName, items, total, invoiceDate }) => (
  <Document>
    <Page style={styles.page}>
      {/* Watermark */}
      <Image src="/logo.png" style={styles.watermark} />

      <Text style={styles.header}>INVOICE</Text>
      <View style={styles.section}>
        <Text style={styles.subHeader}>INVOICE From: Creative Cloud Solutions </Text>
        <Text style={styles.subHeader}>INVOICE TO: {clientName}</Text>
        <Text style={styles.subHeader}>Date: {formatDate(invoiceDate)}</Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Description</Text>
          <Text style={styles.tableCell}>Amount (Rs.)</Text>
          <Text style={styles.tableCell}>Days</Text>
        </View>
        {items.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCell}>{item.description}</Text>
            <Text style={styles.tableCell}>{item.cost.toFixed(2)}</Text>
            <Text style={styles.tableCell}>{item.days}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalCell}>Total Rs. {total.toFixed(2)}</Text>
      </View>

      <View style={styles.contact}>
        <Text style={styles.chead}>Contact Details</Text>
        <center>
          <Text>Mobile No: +91 79841 75557</Text>
          <Text>Email: creativecloudsolutionsccs@gmail.com</Text>
        </center>
        <Text>Website: creativecloudsolutions.online</Text>
        <Text>NOTE: Do Not Accept the Invoice without our Stamp</Text>
      </View>
    </Page>
  </Document>
);

// Main Component
export default function Home() {
  const [items, setItems] = useState([{ description: '', cost: 0, days: 0 }]);
  const [clientName, setClientName] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);

  // Login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Check local storage for login state on initial render
  useEffect(() => {
    const loggedInUser = localStorage.getItem('isLoggedIn');
    if (loggedInUser) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleAddItem = () => {
    setItems([...items, { description: '', cost: 0, days: 0 }]);
  };

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    if (field === 'cost') {
      newItems[index][field] = parseFloat(value) || 0;
    } else if (field === 'days') {
      newItems[index][field] = parseInt(value) || 0;
    } else {
      newItems[index][field] = value; // For text fields like description
    }
    setItems(newItems);
  };

  const total = items.reduce((sum, item) => sum + Number(item.cost), 0);

  const handleLogin = () => {
    // Retrieve username and password from environment variables
    const envUsername = process.env.NEXT_PUBLIC_USERNAME;
    const envPassword = process.env.NEXT_PUBLIC_PASSWORD;

    // Check credentials against environment variables
    if (username === envUsername && password === envPassword) {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true'); // Save login state to local storage
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn'); // Remove login state from local storage
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {!isLoggedIn ? (
        // Login Form
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-4">Login</h1>
          <div className="mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <button
            type="button"
            onClick={handleLogin}
            className="px-4 py-2 bg-gray-700 text-white font-bold hover:bg-orange-300 rounded-lg w-full"
          >
            Login
          </button>
        </div>
      ) : (
        // Invoice Application
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-center mb-4">CCS Invoice</h1>

          {/* Client Name Input */}
          <div className="mb-4">
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client Name"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>

          {/* Date Picker Input */}
          <div className="mb-4">
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>

          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border border-gray-300 text-left">Sr. No.</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Description</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Cost</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Days</th>
                <th className="py-2 px-4 border border-gray-300 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border border-gray-300">{index + 1}</td>
                  <td className="py-2 px-4 border border-gray-300">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleChange(index, 'description', e.target.value)}
                      className="border border-gray-300 rounded-md p-1 w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    <input
                      type="number"
                      placeholder="Cost"
                      value={item.cost}
                      onChange={(e) => handleChange(index, 'cost', e.target.value)}
                      className="border border-gray-300 rounded-md p-1 w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    <input
                      type="number"
                      placeholder="Days"
                      value={item.days}
                      onChange={(e) => handleChange(index, 'days', e.target.value)}
                      className="border border-gray-300 rounded-md p-1 w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border border-gray-300 text-center">
                    <button
                      type="button"
                      onClick={() => setItems(items.filter((_, i) => i !== index))}
                      className="bg-gray-700 text-white p-2 font-bold hover:bg-orange-300 rounded-lg"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="py-2 px-4 border border-gray-300 text-right font-bold" colSpan={2}>Total</td>
                <td className="py-2 px-4 border border-gray-300 text-center font-bold">₹{total.toFixed(2)}</td>
                <td className="py-2 px-4 border border-gray-300"></td>
                <td className="py-2 px-4 border border-gray-300"></td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handleAddItem}
              className="px-4 py-2 bg-gray-700 text-white p-2 font-bold hover:bg-orange-300 rounded-lg"
            >
              Add Item
            </button>
            <PDFDownloadLink
              document={<InvoicePDF clientName={clientName} items={items} total={total} invoiceDate={invoiceDate} />}
              fileName="invoice.pdf"
              className="px-4 py-2 bg-gray-700 text-white p-2 font-bold hover:bg-orange-300 rounded-lg"
            >
              {({ loading }) => (loading ? 'Loading...' : 'Download Invoice')}
            </PDFDownloadLink>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white font-bold hover:bg-red-400 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
