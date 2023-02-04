def parse_out_all_tables_on_page(response):
    # Define a list to store the parsed tables
    tables = []

    # Extract all table elements from the HTML
    elements = response.xpath('//table')

    # Iterate over the table elements and parse them
    for element in elements:
        try:
            table = parse_data_out_of_table(element)
            if table:
                table_id = "-".join(element.xpath(
                    './ancestor-or-self::div/@id').extract()[-3:])
                tables.append({"id": table_id, "data": table})
        except Exception as e:
            pass

    # Return the list of parsed tables
    return tables


def parse_data_out_of_table(table):
    # Define a dictionary to store the parsed values
    data = {}

    # Extract the rows from the table
    rows = table.xpath('./tr')
    if len(rows) == 0:
        return None

    def clean_list_of_null_values(list_of_values):
        return [i for i in list_of_values if i.strip()]

    # Extract the headers from the first row
    headers = clean_list_of_null_values(rows[0].xpath(
        './th/descendant-or-self::text()').extract())
    # Check if the headers are in th elements or td elements
    if headers:
        # If the headers are in th elements, use them as keys
        for i, header in enumerate(headers):
            data[str(header)] = []
        # Iterate over the remaining rows and extract the values
        for row in rows[1:]:
            values = clean_list_of_null_values(
                row.xpath('./td/text() | ./td/descendant-or-self::span/text()').extract())
            for i, value in enumerate(values):
                data[str(headers[i])].append(value)
    else:
        # If the headers are not present, use the indices as keys
        for row in rows:
            values = clean_list_of_null_values(
                row.xpath('./td/descendant-or-self::span/text()').extract())

            for i, value in enumerate(values):
                if i not in data:
                    data[str(i)] = []
                data[str(i)].append(value)

    # Return the dictionary as a JSON string
    if (len(data) > 0):
        return data
    return None
