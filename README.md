# MyData API Information Provider - Bank Account Services

## Overview

This repository implements the **Information Provider** component of the MyData API ecosystem, serving as a secure bank API service that provides account information to authorized MyData applications. The system is protected by the **Certification Authority's intrusion detection system** and follows MyData security specifications.

## System Architecture

The Information Provider is part of the three-component MyData ecosystem:

- **🔐 Certification Authority** - Central authentication and security monitoring
- **🏦 Information Provider** (this system) - Bank API services for account information
- **🏛️ MyData Operator** - Bank API services for account information

## 🏦 Core Banking Services

### Account Information APIs

The Information Provider offers secure access to banking data through standardized MyData APIs:

- **Basic Account Information** - Account metadata, currency, and basic details
- **Detailed Account Information** - Transaction history, balance details, and account status
- **Deposit Account Services** - Savings account information and deposit details

### Security Features

- **OAuth 2.0 Authentication** - Validates tokens issued by Certification Authority
- **API Transaction Logging** - Comprehensive request/response logging for security analysis
- **Request Validation** - Strict parameter validation and sanitization
- **Rate Limiting** - Built-in protection against DDoS and abuse

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Access to Certification Authority (port 3000)

### Installation

1. **Clone and setup**

   ```bash
   cd information-provider-next
   npm install
   ```

2. **Environment Configuration**

   ```bash
   # Copy environment template
   cp .env.example .env

   # Configure database and integration settings
   DATABASE_URL="postgresql://user:password@localhost:5432/info_provider_db"
   CERTIFICATION_AUTHORITY_URL="http://localhost:3000"
   ANYA_CLIENT_ID="your-client-id"
   ANYA_CLIENT_SECRET="your-client-secret"
   ANYA_ORG_CODE="your-org-code"
   ```

3. **Database Setup**

   ```bash
   # Run database migrations
   npx prisma migrate dev

   # Seed account data
   npm run seedAccount
   ```

4. **Start the service**

   ```bash
   npm run dev
   ```

   The Information Provider will be available at: `http://localhost:4000`

## 🔗 API Endpoints

### Bank Account Services

#### Basic Account Information

```
POST /api/v2/bank/accounts/deposit/basic
```

- **Authentication**: Bearer token from Certification Authority
- **Purpose**: Retrieve basic deposit account information
- **Response**: Account currency, saving method, dates, and amounts

#### Detailed Account Information

```
POST /api/v2/bank/accounts/deposit/detail
```

- **Authentication**: Bearer token from Certification Authority
- **Purpose**: Retrieve detailed account information including transactions
- **Response**: Comprehensive account data with transaction history

### Authentication Integration

```
POST /api/oauth/2.0/token
```

- **Purpose**: OAuth token endpoint for bank-to-bank authentication
- **Integration**: Validates certificates from Certification Authority

## 🛡️ Security Integration

### Certification Authority Integration

The Information Provider integrates with the Certification Authority's intrusion detection system:

- **Token Validation** - All API requests validate JWT tokens issued by the CA
- **Request Logging** - Comprehensive logging feeds into the CA's security monitoring
- **Attack Detection** - Participates in the ecosystem-wide threat detection
- **Certificate Management** - Validates digital certificates for secure data exchange

### Security Headers & Validation

- **x-api-tran-id** - Transaction ID validation (25 character format)
- **x-api-type** - Request type validation (regular/irregular)
- **Content-Type** - Strict content type enforcement
- **Authorization** - Bearer token validation with JWT verification

## 🧪 Testing & Simulation

### Normal Operation Testing

```bash
# Simulate normal MyData flow
npm run simulateNormal

# Comprehensive simulation with multiple accounts
npm run simulate
```

### Security Testing

```bash
# Attack simulation for security testing
npm run attack

# Rate limiting overflow tests
npm run attackRateLimit
```

### MyData Flow Simulation

The system includes complete MyData flow simulation:

1. **IA101** - Token request to Certification Authority
2. **IA102** - Certificate signing request
3. **IA103** - Certificate signing result
4. **IA104** - Certificate verification
5. **IA002** - Bank-to-bank authentication
6. **Account Data Retrieval** - Secure account information access

## 📊 Data Models

### Account Information

```typescript
interface Account {
	accountNum: string; // Unique account identifier
	accountStatus: string; // Account status
	accountType: string; // Account type
	firstName: string; // Account holder first name
	lastName: string; // Account holder last name
	orgCode: string; // Organization code
	phoneNumber: string; // Contact phone number
	balanceAmt: number; // Current balance
	currencyCode: string; // Currency code
}
```

### Deposit Account Details

```typescript
interface DepositAccount {
	depositId: string; // Unique deposit identifier
	balanceAmt: number; // Available balance
	commitAmt: number; // Committed amount
	currencyCode: string; // Currency code
	expDate: Date; // Expiration date
	issueDate: Date; // Issue date
	savingMethod: string; // Saving method type
	withdrawableAmt: number; // Withdrawable amount
}
```

## 🔧 Configuration

### Environment Variables

```env
# Database Configuration
DATABASE_URL="postgresql://localhost:5432/info_provider"
DIRECT_URL="postgresql://localhost:5432/info_provider"

# Integration Settings
CERTIFICATION_AUTHORITY_URL="http://localhost:3000"
BOND_BANK_API="http://localhost:4200"  # MyData Operator URL

# Organization Credentials
ANYA_CLIENT_ID="your-client-id"
ANYA_CLIENT_SECRET="your-client-secret"
ANYA_ORG_CODE="your-organization-code"
ANYA_ORG_SERIAL_CODE="your-serial-code"

# Security Settings
JWT_SECRET="your-jwt-secret"
```

### Bank Configuration

The Information Provider can be configured to represent different banks:

- **ANYA Bank** - Primary configuration
- **BOND Bank** - Alternative configuration
- **Custom Bank** - Custom organization setup

## 🐳 Docker Deployment

```bash
# Build container
docker build -t mydata-info-provider .

# Run with environment variables
docker run -p 4000:4000 \
  -e DATABASE_URL="your-db-url" \
  -e CERTIFICATION_AUTHORITY_URL="http://ca:3000" \
  mydata-info-provider
```

## 📈 Monitoring & Logging

### Security Monitoring

The Information Provider contributes to ecosystem-wide security monitoring:

- **Request/Response Logging** - All API calls logged for security analysis
- **Attack Pattern Detection** - Participates in signature-based detection
- **Anomaly Detection** - Feeds data to specification-based detection
- **Performance Metrics** - Response time and availability monitoring

### Log Format

```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "method": "POST",
  "url": "/api/v2/bank/accounts/deposit/basic",
  "headers": {...},
  "body": {...},
  "response": {...},
  "status": 200,
  "orgCode": "ANYA001"
}
```

## 🤝 Integration with MyData Ecosystem

### Certification Authority Integration

- **Authentication Flow** - Validates OAuth tokens from CA
- **Security Monitoring** - Logs feed into CA's intrusion detection
- **Certificate Validation** - Verifies digital certificates for secure transactions

### MyData Operator Integration

- **Cross-Bank Authentication** - Secure bank-to-bank communication
- **Data Exchange** - Standardized account information sharing
- **Consent Management** - Handles user consent for data sharing

## 📁 Project Structure

```
information-provider-next/
├── app/
│   ├── (routes)/account/mydata/    # MyData account pages
│   ├── _components/                # UI components
│   ├── _providers/                 # React providers
│   └── api/                        # Bank API endpoints
├── constants/                      # Response messages and bank data
├── hooks/                         # React hooks for data fetching
├── prisma/                        # Database schema and migrations
├── scripts/                       # Simulation and testing scripts
├── types/                         # TypeScript type definitions
└── utils/                         # Utilities for logging and validation
```

## 🛠️ Development

### Adding New Bank Services

1. **Create API Route** - Add new endpoint in `app/api/v2/bank/`
2. **Update Schema** - Modify Prisma schema if needed
3. **Add Validation** - Implement request/response validation
4. **Update Simulation** - Add test scenarios

### Testing New Features

```bash
# Test specific simulation scenarios
npm run simulate

# Test authentication flow
npm run simulateNormal

# Test attack scenarios
npm run attack
```

## 📝 MyData Compliance

This Information Provider complies with MyData ecosystem standards:

- **API Specification** - Follows MyData API format requirements
- **Security Standards** - Implements required security measures
- **Data Privacy** - Handles customer data according to privacy regulations
- **Consent Management** - Proper consent handling for data sharing

## 🔍 Troubleshooting

### Common Issues

1. **Authentication Failures**

   - Verify Certification Authority is running on port 3000
   - Check client credentials in environment variables

2. **Database Connection Issues**

   - Ensure PostgreSQL is running
   - Verify DATABASE_URL configuration

3. **Integration Problems**
   - Check network connectivity between services
   - Verify environment variable configuration

## 📚 API Documentation

### Request Headers

All API requests must include:

```
Authorization: Bearer <jwt-token>
x-api-tran-id: <25-character-transaction-id>
x-api-type: regular|irregular
Content-Type: application/json;charset=UTF-8
```

### Response Format

All responses follow the MyData standard format:

```json
{
  "x-api-tran-id": "transaction-id",
  "rsp_code": "0000",
  "rsp_msg": "Success",
  "search_timestamp": "20240101120000",
  "data": {...}
}
```

---

**Integration Notice**: This Information Provider is designed to work seamlessly with the MyData Certification Authority's intrusion detection system. Ensure proper configuration and network connectivity for optimal security monitoring.
