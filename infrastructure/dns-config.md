# DNS Configuration for militarylegalshield.com

## Required DNS Records

### A Records (Primary Domain)
```
Type: A
Name: @
Value: [Your Server IP Address]
TTL: 300 (5 minutes)
```

```
Type: A
Name: www
Value: [Your Server IP Address]
TTL: 300 (5 minutes)
```

### CNAME Records (Subdomains)
```
Type: CNAME
Name: api
Value: militarylegalshield.com
TTL: 300
```

```
Type: CNAME
Name: cdn
Value: militarylegalshield.com
TTL: 300
```

### MX Records (Email)
```
Type: MX
Name: @
Value: mail.militarylegalshield.com
Priority: 10
TTL: 3600
```

### TXT Records (Verification & Security)

#### Domain Verification
```
Type: TXT
Name: @
Value: "militarylegalshield-domain-verification=Q85aT0P23qZ2zCKZHOIHSzE6ve727hMw5mBqlsect6k"
TTL: 300
```

#### SPF Record
```
Type: TXT
Name: @
Value: "v=spf1 include:_spf.google.com include:mailgun.org ~all"
TTL: 3600
```

#### DMARC Policy
```
Type: TXT
Name: _dmarc
Value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@militarylegalshield.com; ruf=mailto:dmarc@militarylegalshield.com; fo=1"
TTL: 3600
```

#### DKIM Key
```
Type: TXT
Name: default._domainkey
Value: "v=DKIM1; k=rsa; p=[Your DKIM Public Key]"
TTL: 3600
```

### CAA Records (Certificate Authority Authorization)
```
Type: CAA
Name: @
Value: 0 issue "letsencrypt.org"
TTL: 3600
```

```
Type: CAA
Name: @
Value: 0 issuewild "letsencrypt.org"
TTL: 3600
```

## CloudFlare Configuration (Recommended)

### DNS Settings
- Proxy Status: Proxied (Orange Cloud) for @ and www
- SSL/TLS Mode: Full (Strict)
- Always Use HTTPS: On
- Automatic HTTPS Rewrites: On

### Security Settings
- Security Level: Medium
- Challenge Passage: 30 minutes
- Browser Integrity Check: On
- Hotlink Protection: On

### Performance Settings
- Caching Level: Standard
- Browser Cache TTL: 4 hours
- Always Online: On
- Mirage: On
- Polish: Lossless

## DNS Propagation Check
After configuring DNS records, verify propagation:
```bash
# Check A record
dig A militarylegalshield.com

# Check CNAME records
dig CNAME www.militarylegalshield.com

# Check MX records
dig MX militarylegalshield.com

# Check TXT records
dig TXT militarylegalshield.com
```

## Expected Response Times
- DNS Query Response: < 50ms
- Global Propagation: 24-48 hours
- CloudFlare Cache: < 100ms globally