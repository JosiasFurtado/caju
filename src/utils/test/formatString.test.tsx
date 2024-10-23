import { formatCpf, formatDate } from '~/utils/formatString'

describe('formatCpf', () => {
  it('should format a CPF string correctly', () => {
    const cpf = '12345678901'
    const formattedCpf = formatCpf(cpf)
    expect(formattedCpf).toBe('123.456.789-01')
  })

  it('should remove non-numeric characters and format the CPF', () => {
    const cpf = '123.456.789-01'
    const formattedCpf = formatCpf(cpf)
    expect(formattedCpf).toBe('123.456.789-01')
  })

  it('should handle CPF with fewer than 11 digits', () => {
    const cpf = '12345678'
    const formattedCpf = formatCpf(cpf)
    expect(formattedCpf).toBe('123.456.78')
  })

  it('should return an empty string if input is an empty string', () => {
    const cpf = ''
    const formattedCpf = formatCpf(cpf)
    expect(formattedCpf).toBe('')
  })
})

describe('formatDate', () => {
  it('should format a valid ISO date string to DD/MM/YYYY format', () => {
    const isoDate = '2024-10-23T10:00:00Z'
    const formattedDate = formatDate(isoDate)
    expect(formattedDate).toBe('23/10/2024')
  })
})
