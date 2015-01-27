

def parse(content):
    """Convert frontmatter to dictionary

    Input:
        ---
        key1: value1
        key2: value2
        ---
        Content

    Output:
        Content, {"key1": "value1", "key2": "value2"}

    """

    metadata = {}

    try:
        _, raw_metadata, content = content.split("---", 2)

        for declaration in raw_metadata.split("\n"):
            if ":" not in declaration:
                continue

            key, value = declaration.split(":")
            value = value.strip()  # Remove padded spaces
            metadata[key] = value

    except ValueError:
        pass

    return metadata


def strip(content):
    try:
        _, metadata, content = content.split("---", 2)
    except:
        pass

    return content
