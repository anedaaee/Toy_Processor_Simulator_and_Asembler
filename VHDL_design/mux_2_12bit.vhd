library ieee;
use ieee.STD_LOGIC_1164.all;


entity Mux_2_12bit is 
	generic (au_bw : integer := 12);
	port (
		input_0 ,input_1: in std_logic_vector(au_bw - 1 downto 0) := (others => '0');
		sel : in std_logic := '0';
		output : out std_logic_vector(au_bw - 1 downto 0) := (others => '0')
	);
end Mux_2_12bit;


architecture Behavioral of Mux_2_12bit is

begin
	process(input_0 ,input_1,sel)
	
	begin
			case sel is
				when '0' => output <= input_0;
				when '1' => output <= input_1;
				when others => output <= (others => '0');
			end case;		
	end process;


end Behavioral;
